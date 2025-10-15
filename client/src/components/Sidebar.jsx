import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { roles } from '../utils/roles'

const links = [
  { to: '/dashboard', label: 'Dashboard', roles: [roles.Admin, roles.BaseCommander, roles.LogisticsOfficer] },
  { to: '/purchases', label: 'Purchases', roles: [roles.Admin, roles.LogisticsOfficer] },
  { to: '/transfers', label: 'Transfers', roles: [roles.Admin, roles.BaseCommander, roles.LogisticsOfficer] },
  { to: '/assignments', label: 'Assignments', roles: [roles.Admin, roles.BaseCommander] },
  { to: '/expenditures', label: 'Expenditures', roles: [roles.Admin, roles.BaseCommander] },
]

export default function Sidebar() {
  const { role } = useAuth()

  return (
    <aside className="w-64 border-r border-gray-200 bg-white hidden md:block">
      <nav className="p-4 space-y-1">
        {links.filter(l => !role || l.roles.includes(role)).map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) => `block px-3 py-2 rounded-md text-sm ${isActive ? 'bg-emerald-100 text-emerald-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}