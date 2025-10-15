export default function Table({ columns, data, emptyText = 'No data' }) {
  return (
    <div className="overflow-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            {columns.map((c) => (
              <th key={c.key} className="py-2 pr-3">{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b">
              {columns.map((c) => (
                <td key={c.key} className="py-2 pr-3">{row[c.key]}</td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td className="py-2 text-gray-500" colSpan={columns.length}>{emptyText}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}