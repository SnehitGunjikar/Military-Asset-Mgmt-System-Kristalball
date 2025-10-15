import { useEffect, useState } from 'react'
import api from '../services/api'

const bases = ['Alpha', 'Bravo', 'Charlie']

export default function Purchases() {
  const [form, setForm] = useState({ asset: '', base: '', quantity: '', purchaseDate: '' })
  const [filters, setFilters] = useState({ base: '', date: '' })
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const onFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const onFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value })

  const fetchItems = async () => {
    setLoading(true); setError(null)
    try {
      const { data } = await api.get('/purchases', { params: filters })
      setItems(data || [])
    } catch (err) {
      setError('Failed to load purchases')
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchItems() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      await api.post('/purchases', form)
      setForm({ asset: '', base: '', quantity: '', purchaseDate: '' })
      fetchItems()
    } catch (err) {
      setError('Failed to add purchase')
    } finally { setLoading(false) }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-emerald-700 mb-4">Purchases</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card lg:col-span-1">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Add Purchase</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="label">Asset</label>
              <input name="asset" className="input" value={form.asset} onChange={onFormChange} required />
            </div>
            <div>
              <label className="label">Base</label>
              <select name="base" className="input" value={form.base} onChange={onFormChange} required>
                <option value="">Select base</option>
                {bases.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Quantity</label>
              <input type="number" name="quantity" className="input" value={form.quantity} onChange={onFormChange} required />
            </div>
            <div>
              <label className="label">Purchase Date</label>
              <input type="date" name="purchaseDate" className="input" value={form.purchaseDate} onChange={onFormChange} required />
            </div>
            <button className="btn btn-primary w-full" disabled={loading} type="submit">{loading ? 'Saving...' : 'Submit'}</button>
          </form>
        </div>

        <div className="card lg:col-span-2">
          <div className="flex flex-wrap items-end gap-3 mb-3">
            <div>
              <label className="label">Filter by Base</label>
              <select name="base" className="input" value={filters.base} onChange={onFilterChange}>
                <option value="">All</option>
                {bases.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Filter by Date</label>
              <input type="date" name="date" className="input" value={filters.date} onChange={onFilterChange} />
            </div>
            <button className="btn btn-secondary" onClick={fetchItems} disabled={loading}>{loading ? 'Loading...' : 'Apply'}</button>
          </div>

          {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-3">Asset</th>
                  <th className="py-2 pr-3">Base</th>
                  <th className="py-2 pr-3">Quantity</th>
                  <th className="py-2 pr-3">Purchase Date</th>
                  <th className="py-2 pr-3">Added By</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2 pr-3">{it.asset}</td>
                    <td className="py-2 pr-3">{it.base}</td>
                    <td className="py-2 pr-3">{it.quantity}</td>
                    <td className="py-2 pr-3">{new Date(it.purchaseDate).toLocaleDateString()}</td>
                    <td className="py-2 pr-3">{it.addedBy}</td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td className="py-2 text-gray-500" colSpan={5}>No purchases found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}