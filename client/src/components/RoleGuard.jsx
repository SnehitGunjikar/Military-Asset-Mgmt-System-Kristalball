import { useAuth } from '../context/AuthContext'

export default function RoleGuard({ allowed, children }) {
  const { role } = useAuth()
  if (allowed && role && !allowed.includes(role)) {
    return null
  }
  return children
}