export default function SummaryCard({ title, value, hint }) {
  return (
    <div className="card">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {hint && <span className="text-xs text-gray-400">{hint}</span>}
      </div>
      <div className="mt-2 text-2xl font-semibold text-emerald-700">{value}</div>
    </div>
  )}