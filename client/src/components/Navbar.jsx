import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-semibold text-emerald-700">Military Asset Management</span>
          <span className="hidden sm:inline text-xs px-2 py-1 rounded bg-emerald-100 text-emerald-700">Jai Ho!</span>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">{user?.name}</span>
              <span className="mx-2">•</span>
              <span>{user?.role}</span>
            </div>
          )}
          <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </header>
  )
}