import { Routes, Route } from 'react-router-dom'
import WebflowPage from './components/WebflowPage'
import ExportCSV from './pages/ExportCSV'
import { PAGE_MAP, SEO_MAP } from './lib/seoConfig'

export default function App() {
  return (
    <Routes>
      {Object.entries(PAGE_MAP).map(([route, htmlFile]) => (
        <Route
          key={route}
          path={route}
          element={
            <WebflowPage
              htmlFile={htmlFile}
              seo={SEO_MAP[route]}
            />
          }
        />
      ))}
      <Route path="/admin/export-csv" element={<ExportCSV />} />
    </Routes>
  )
}
