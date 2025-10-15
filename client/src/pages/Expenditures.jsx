import { useEffect, useState } from 'react'
import api from '../services/api'

const reasons = ['Used', 'Damaged', 'Expired']

export default function Expenditures() {
  const [form, setForm] = useState({ asset: '', quantity: '', reason: reasons[0], date: '' })
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const onFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const fetchItems = async () => {
    setLoading(true); setError(null)
    try {
      const { data } = await api.get('/expenditures')
      setItems(data || [])
    } catch (err) {
      setError('Failed to load expenditures')
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchItems() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      await api.post('/expenditures', form)
      setForm({ asset: '', quantity: '', reason: reasons[0], date: '' })
      fetchItems()
    } catch (err) {
      setError('Failed to add expenditure')
    } finally { setLoading(false) }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-emerald-700 mb-4">Expenditures</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card lg:col-span-1">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Record Expenditure</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="label">Asset</label>
              <input name="asset" className="input" value={form.asset} onChange={onFormChange} required />
            </div>
            <div>
              <label className="label">Quantity</label>
              <input type="number" name="quantity" className="input" value={form.quantity} onChange={onFormChange} required />
            </div>
            <div>
              <label className="label">Reason</label>
              <select name="reason" className="input" value={form.reason} onChange={onFormChange}>
                {reasons.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Date</label>
              <input type="date" name="date" className="input" value={form.date} onChange={onFormChange} required />
            </div>
            <button className="btn btn-primary w-full" disabled={loading} type="submit">{loading ? 'Saving...' : 'Submit'}</button>
          </form>
        </div>

        <div className="card lg:col-span-2">
          {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-3">Asset</th>
                  <th className="py-2 pr-3">Quantity</th>
                  <th className="py-2 pr-3">Reason</th>
                  <th className="py-2 pr-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2 pr-3">{it.asset}</td>
                    <td className="py-2 pr-3">{it.quantity}</td>
                    <td className="py-2 pr-3">{it.reason}</td>
                    <td className="py-2 pr-3">{new Date(it.date).toLocaleDateString()}</td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td className="py-2 text-gray-500" colSpan={4}>No expenditures found</td>
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