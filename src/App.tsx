import { Routes, Route } from 'react-router-dom'
import WebflowPage from './components/WebflowPage'

const PAGE_MAP: Record<string, string> = {
  '/': '/html/home.html',
  '/about-us': '/html/about-us.html',
  '/blog': '/html/blog.html',
  '/blog/founders-of-12brave-interview': '/html/blog-founders.html',
  '/blog/interview-mariia-lukianova': '/html/blog-mariia.html',
  '/thank-you': '/html/thank-you.html',
  '/privacy-policy---12brave': '/html/privacy-policy.html',
  '/terms': '/html/terms.html',
  '/topplatforms': '/html/topplatforms.html',
  '/download/guide': '/html/download-guide.html',
  '/download/program': '/html/download-program.html',
}

const SEO_MAP: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Side Business Course for Professionals | 12BRAVE Program',
    description: 'Start your side business without quitting your job. 12BRAVE: 12-week entrepreneurship program for European professionals. Mentoring, community, real results.',
  },
  '/about-us': {
    title: 'About us | 12BRAVE',
    description: 'Meet the founders of 12BRAVE — former corporate managers helping European professionals launch side businesses.',
  },
  '/blog': {
    title: 'Blog | 12BRAVE',
    description: '12BRAVE blog — interviews, case studies, and resources for aspiring side-business founders.',
  },
  '/blog/founders-of-12brave-interview': {
    title: 'Founders of 12BRAVE: "We wanted to create a real impact" | 12BRAVE',
    description: 'Interview with the founders of 12BRAVE about the project, challenges and plans for the future.',
  },
  '/blog/interview-mariia-lukianova': {
    title: 'How to make your project a fun hobby that pays you - Mariia Lukianova | 12BRAVE',
    description: 'From corporate R&D to charity and startup fundraising, 12BRAVE mentor Mariia Lukianova shows how turning your side project into a fun hobby that pays can lead to real impact.',
  },
  '/thank-you': {
    title: 'Thank You – Your Download is Ready | 12BRAVE',
    description: "We've received your submission. You can download your file below.",
  },
  '/privacy-policy---12brave': {
    title: 'Privacy Policy - 12BRAVE',
    description: 'Privacy Policy for 12BRAVE entrepreneurship program.',
  },
  '/terms': {
    title: 'Terms & Conditions | 12BRAVE',
    description: 'Terms and Conditions for the 12BRAVE program.',
  },
  '/topplatforms': {
    title: '5K Guide - Top 50 Platforms | 12BRAVE',
    description: 'Download the Top 50 Platforms List from 12BRAVE.',
  },
  '/download/guide': {
    title: 'Download Your Guide | 12BRAVE',
    description: 'Download the 12BRAVE guide.',
  },
  '/download/program': {
    title: 'Download Program Curriculum | 12BRAVE',
    description: 'Download the 12BRAVE program curriculum.',
  },
}

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
              title={SEO_MAP[route]?.title || '12BRAVE'}
              description={SEO_MAP[route]?.description || ''}
            />
          }
        />
      ))}
    </Routes>
  )
}
