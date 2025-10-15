import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import RoleGuard from './components/RoleGuard'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Purchases from './pages/Purchases'
import Transfers from './pages/Transfers'
import Assignments from './pages/Assignments'
import Expenditures from './pages/Expenditures'
import { roles } from './utils/roles'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route
              path="/dashboard"
              element={<RoleGuard allowed={[roles.Admin, roles.BaseCommander, roles.LogisticsOfficer]}><Dashboard /></RoleGuard>}
            />
            <Route
              path="/purchases"
              element={<RoleGuard allowed={[roles.Admin, roles.LogisticsOfficer]}><Purchases /></RoleGuard>}
            />
            <Route
              path="/transfers"
              element={<RoleGuard allowed={[roles.Admin, roles.BaseCommander, roles.LogisticsOfficer]}><Transfers /></RoleGuard>}
            />
            <Route
              path="/assignments"
              element={<RoleGuard allowed={[roles.Admin, roles.BaseCommander]}><Assignments /></RoleGuard>}
            />
            <Route
              path="/expenditures"
              element={<RoleGuard allowed={[roles.Admin, roles.BaseCommander]}><Expenditures /></RoleGuard>}
            />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
