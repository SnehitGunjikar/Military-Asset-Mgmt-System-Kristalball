import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { roles, roleOptions } from '../utils/roles'
import Footer from '../components/Footer'

// Use UI-friendly labels while sending server enum values
const roleSelectOptions = roleOptions

export default function Register() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: roles.LogisticsOfficer })
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  const bgUrl = '/militarypics.jpg'

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
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgUrl})` }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        {/* Left-top app title, larger */}
        <div className="absolute top-6 left-6">
          <h1 className="text-white text-4xl sm:text-5xl font-extrabold tracking-wide">Military Asset <br />Management</h1>
        </div>

        <div className="w-full max-w-md card !bg-white/50 backdrop-blur-sm border border-white/50 shadow-xl ring-1 ring-white/40">
          <h2 className="text-xl font-bold text-emerald-700 mb-4">Create account</h2>
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
                {roleSelectOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <button className="btn btn-primary w-full" disabled={loading} type="submit">{loading ? 'Registering...' : 'Register'}</button>
          </form>
          <p className="mt-3 text-sm text-grey-600">Have an account? <Link className="text-emerald-700 hover:underline" to="/login">Login</Link></p>
        </div>
        

        {/* Footer overlay on auth pages */}
        <div className="absolute bottom-0 left-0 right-0 text-white/90">
          <Footer />
        </div>
      </div>
    </div>
  )
}