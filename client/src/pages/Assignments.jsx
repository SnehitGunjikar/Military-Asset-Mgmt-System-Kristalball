import { useEffect, useState } from 'react'
import api from '../services/api'

export default function Assignments() {
  const [form, setForm] = useState({ asset: '', quantity: '', assignedTo: '', assignmentDate: '' })
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [remaining, setRemaining] = useState(null)

  const onFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const fetchItems = async () => {
    setLoading(true); setError(null)
    try {
      const { data } = await api.get('/assignments')
      setItems(data || [])
    } catch (err) {
      setError('Failed to load assignments')
    } finally { setLoading(false) }
  }

  const fetchRemaining = async () => {
    try {
      const { data } = await api.get('/assignments/remaining')
      setRemaining(data?.remaining ?? null)
    } catch {}
  }

  useEffect(() => { fetchItems(); fetchRemaining() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      await api.post('/assignments', form)
      setForm({ asset: '', quantity: '', assignedTo: '', assignmentDate: '' })
      fetchItems(); fetchRemaining()
    } catch (err) {
      setError('Failed to add assignment')
    } finally { setLoading(false) }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-emerald-700 mb-4">Assignments</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card lg:col-span-1">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Assign Asset</h3>
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
              <label className="label">Assigned To</label>
              <input name="assignedTo" className="input" value={form.assignedTo} onChange={onFormChange} required />
            </div>
            <div>
              <label className="label">Assignment Date</label>
              <input type="date" name="assignmentDate" className="input" value={form.assignmentDate} onChange={onFormChange} required />
            </div>
            <button className="btn btn-primary w-full" disabled={loading} type="submit">{loading ? 'Saving...' : 'Submit'}</button>
          </form>
          {remaining !== null && (
            <div className="mt-3 text-sm text-gray-600">Remaining balance: <span className="font-medium">{remaining}</span></div>
          )}
        </div>

        <div className="card lg:col-span-2">
          {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-3">Asset</th>
                  <th className="py-2 pr-3">Quantity</th>
                  <th className="py-2 pr-3">Assigned To</th>
                  <th className="py-2 pr-3">Assignment Date</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2 pr-3">{it.asset}</td>
                    <td className="py-2 pr-3">{it.quantity}</td>
                    <td className="py-2 pr-3">{it.assignedTo}</td>
                    <td className="py-2 pr-3">{new Date(it.assignmentDate).toLocaleDateString()}</td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td className="py-2 text-gray-500" colSpan={4}>No assignments found</td>
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