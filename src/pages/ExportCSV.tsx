export default function ExportCSV() {
  return (
    <div style={{
      fontFamily: 'Manrope, sans-serif',
      maxWidth: 600,
      margin: '80px auto',
      padding: 32,
      textAlign: 'center',
    }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>12BRAVE - Form Submissions</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>
        All form submissions are logged to a Google Sheet in real time.
        Open the sheet to view, filter, or download as Excel/CSV.
      </p>
      <p style={{ fontSize: 14, color: '#999', marginTop: 24 }}>
        If Supabase is also connected, submissions are stored there too
        (Supabase Dashboard &gt; Table Editor &gt; form_submissions &gt; Export).
      </p>
    </div>
  )
}
