import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Footer from '../components/Footer'

export default function Login() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const bgUrl = '/militarypics.jpg'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    const res = await login(email, password)
    if (res.success) {
      navigate('/dashboard')
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
          <h1 className="text-white text-4xl sm:text-5xl font-extrabold tracking-wide">Military Asset <br/>Management</h1>
        </div>

        <div className="w-full max-w-md card !bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl ring-1 ring-white/40">
          <h2 className="text-xl font-bold text-emerald-700 mb-4">Sign in</h2>
          {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button className="btn btn-primary w-full" disabled={loading} type="submit">{loading ? 'Signing in...' : 'Sign in'}</button>
          </form>
          <p className="mt-3 text-sm text-gray-600">No account? <Link className="text-emerald-700 hover:underline" to="/register">Register</Link></p>
        </div>
      

        {/* Footer overlay on auth pages */}
        <div className="absolute bottom-0 left-0 right-0 text-white/90">
          <Footer />
        </div>
      </div>
    </div>
  )
}