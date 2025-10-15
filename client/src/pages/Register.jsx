import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { roles } from '../utils/roles'

const roleOptions = [roles.Admin, roles.BaseCommander, roles.LogisticsOfficer]

export default function Register() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: roles.LogisticsOfficer })
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null); setMessage(null)
    const res = await register(form)
    if (res.success) {
      setMessage('Registration successful. Please login.')
      setTimeout(() => navigate('/login'), 1200)
    } else {
      setError(res.error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md card">
        <h2 className="text-xl font-semibold text-emerald-700 mb-4">Create account</h2>
        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
        {message && <div className="mb-3 text-sm text-emerald-700">{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="label">Name</label>
            <input name="name" className="input" value={form.name} onChange={onChange} required />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" name="email" className="input" value={form.email} onChange={onChange} required />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" name="password" className="input" value={form.password} onChange={onChange} required />
          </div>
          <div>
            <label className="label">Role</label>
            <select name="role" className="input" value={form.role} onChange={onChange}>
              {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <button className="btn btn-primary w-full" disabled={loading} type="submit">{loading ? 'Registering...' : 'Register'}</button>
        </form>
        <p className="mt-3 text-sm text-gray-600">Have an account? <Link className="text-emerald-700 hover:underline" to="/login">Login</Link></p>
      </div>
    </div>
  )
}