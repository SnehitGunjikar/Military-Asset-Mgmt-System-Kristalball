import { useEffect, useState } from 'react'
import api from '../services/api'
import SummaryCard from '../components/SummaryCard'

const bases = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo']
const equipmentTypes = ['Rifle', 'Ammo', 'Medkit', 'Radio', 'Other']

export default function Dashboard() {
  const [filters, setFilters] = useState({ startDate: '', endDate: '', base: '', equipmentType: '' })
  const [data, setData] = useState({ openingBalance: 0, closingBalance: 0, netMovement: 0, assignedAssets: 0, expendedAssets: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const onChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value })

  const fetchData = async () => {
    setLoading(true); setError(null)
    try {
      const { data } = await api.get('/dashboard', { params: filters })
      setData(data)
    } catch (err) {
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  return (
    <div>
      <h2 className="text-lg font-semibold text-emerald-700 mb-4">Dashboard</h2>
      <div className="card mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="label">Start Date</label>
            <input type="date" name="startDate" className="input" value={filters.startDate} onChange={onChange} />
          </div>
          <div>
            <label className="label">End Date</label>
            <input type="date" name="endDate" className="input" value={filters.endDate} onChange={onChange} />
          </div>
          <div>
            <label className="label">Base</label>
            <select name="base" className="input" value={filters.base} onChange={onChange}>
              <option value="">All</option>
              {bases.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Equipment Type</label>
            <select name="equipmentType" className="input" value={filters.equipmentType} onChange={onChange}>
              <option value="">All</option>
              {equipmentTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button className="btn btn-secondary mr-2" onClick={() => setFilters({ startDate: '', endDate: '', base: '', equipmentType: '' })}>Reset</button>
          <button className="btn btn-primary" onClick={fetchData} disabled={loading}>{loading ? 'Loading...' : 'Apply Filters'}</button>
        </div>
      </div>

      {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SummaryCard title="Opening Balance" value={data.openingBalance} />
        <SummaryCard title="Closing Balance" value={data.closingBalance} />
        <SummaryCard title="Net Movement" value={data.netMovement} hint="Purchases + Transfers In − Transfers Out" />
        <SummaryCard title="Assigned Assets" value={data.assignedAssets} />
        <SummaryCard title="Expended Assets" value={data.expendedAssets} />
      </div>
    </div>
  )
}