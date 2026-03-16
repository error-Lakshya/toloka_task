import { useState } from 'react'
import { getAllSubmissions, submissionsToCSV, downloadCSV } from '../lib/formHandler'

export default function ExportCSV() {
  const [count, setCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      const rows = await getAllSubmissions()
      setCount(rows.length)
      if (rows.length === 0) return
      const csv = submissionsToCSV(rows)
      const date = new Date().toISOString().slice(0, 10)
      downloadCSV(csv, `12brave-submissions-${date}.csv`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      fontFamily: 'Manrope, sans-serif',
      maxWidth: 600,
      margin: '80px auto',
      padding: 32,
      textAlign: 'center',
    }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>12BRAVE - Export Form Submissions</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>
        Download all form submissions stored on this device as a CSV file
        (opens in Excel / Google Sheets).
      </p>
      <button
        onClick={handleExport}
        disabled={loading}
        style={{
          background: '#111',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '12px 32px',
          fontSize: 16,
          cursor: loading ? 'wait' : 'pointer',
        }}
      >
        {loading ? 'Exporting...' : 'Export CSV'}
      </button>
      {count !== null && (
        <p style={{ marginTop: 16, color: count > 0 ? '#16a34a' : '#666' }}>
          {count > 0
            ? `Downloaded ${count} submission${count > 1 ? 's' : ''}.`
            : 'No submissions found on this device.'}
        </p>
      )}
      <p style={{ marginTop: 32, fontSize: 13, color: '#999' }}>
        Submissions are stored in the browser's IndexedDB on the device where
        forms were submitted. For centralized storage across devices, connect Supabase.
      </p>
    </div>
  )
}
