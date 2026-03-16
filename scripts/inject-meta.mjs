/**
 * Post-build script: injects per-page SEO meta tags into static HTML files.
 *
 * For each route in SEO_MAP, creates a copy of dist/index.html at the
 * correct path (e.g., dist/about-us/index.html) with the real <title>,
 * <meta description>, <link canonical>, OG/Twitter tags, and JSON-LD
 * baked into the <head>. This ensures crawlers, social bots, and link
 * unfurlers see correct meta tags without executing JavaScript.
 *
 * Run after `vite build`: node scripts/inject-meta.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST = join(__dirname, '..', 'dist')
const SITE_URL = 'https://12brave.com'
const OG_IMAGE = 'https://cdn.prod.website-files.com/687fa761be60df02646a1dc0/68d0378c1ed599b79a0398c6_Screenshot%202025-09-21%20193552.png'

// SEO data for all 11 routes (must match src/lib/seoConfig.ts)
const pages = [
  {
    path: '/',
    title: 'Side Business Course for Professionals | 12BRAVE Program',
    description: 'Start your side business without quitting your job. 12BRAVE: 12-week entrepreneurship program for European professionals. Mentoring, community, real results.',
    ogTitle: '12BRAVE: Side Business Program for Working Professionals',
    ogDescription: 'Join 12BRAVE - the entrepreneurship program helping European professionals start successful side businesses while working full-time.',
    ogType: 'website',
    ogImage: OG_IMAGE,
    jsonLd: { '@context': 'https://schema.org', '@type': 'EducationalOrganization', name: '12BRAVE', url: SITE_URL, description: 'Start your side business without quitting your job. 12BRAVE: 12-week entrepreneurship program for European professionals.' },
  },
  {
    path: '/about-us',
    title: 'About us | 12BRAVE',
    description: 'Meet the founders of 12BRAVE - former corporate managers helping European professionals launch side businesses in 12 weeks with mentoring and community support.',
    ogTitle: 'About 12BRAVE - Our Story & Founders',
    ogDescription: 'Meet Ekaterina and Victoria, former corporate managers who created 12BRAVE to help European professionals start side businesses.',
    ogType: 'website',
    ogImage: OG_IMAGE,
    jsonLd: { '@context': 'https://schema.org', '@type': 'AboutPage', name: 'About 12BRAVE', url: `${SITE_URL}/about-us` },
  },
  {
    path: '/blog',
    title: 'Blog | 12BRAVE',
    description: '12BRAVE blog - interviews with founders and mentors, case studies, and practical resources for aspiring side-business founders in Europe.',
    ogTitle: '12BRAVE Blog - Stories & Resources for Side-Business Founders',
    ogDescription: 'Interviews, case studies, and practical resources from the 12BRAVE entrepreneurship community.',
    ogType: 'website',
    ogImage: OG_IMAGE,
    jsonLd: { '@context': 'https://schema.org', '@type': 'Blog', name: '12BRAVE Blog', url: `${SITE_URL}/blog` },
  },
  {
    path: '/blog/founders-of-12brave-interview',
    title: 'Founders of 12BRAVE: "We wanted to create a real impact" | 12BRAVE',
    description: 'Interview with Ekaterina and Victoria, co-founders of 12BRAVE, on why they left corporate careers to build an entrepreneurship program for professionals across Europe.',
    ogTitle: 'Founders of 12BRAVE: "We wanted to create a real impact"',
    ogDescription: 'Interview with the co-founders of 12BRAVE on leaving corporate careers to help European professionals start side businesses.',
    ogType: 'article',
    ogImage: OG_IMAGE,
    jsonLd: { '@context': 'https://schema.org', '@type': 'Article', headline: 'Founders of 12BRAVE: "We wanted to create a real impact"', url: `${SITE_URL}/blog/founders-of-12brave-interview` },
  },
  {
    path: '/blog/interview-mariia-lukianova',
    title: 'How to make your project a fun hobby that pays you - Mariia Lukianova | 12BRAVE',
    description: 'From corporate R&D to charity and startup fundraising - 12BRAVE mentor Mariia Lukianova on turning a side project into a rewarding hobby that generates income.',
    ogTitle: 'How to make your project a fun hobby that pays you - Mariia Lukianova',
    ogDescription: '12BRAVE mentor Mariia Lukianova shares how she transitioned from corporate R&D to building projects that create real impact.',
    ogType: 'article',
    ogImage: OG_IMAGE,
    jsonLd: { '@context': 'https://schema.org', '@type': 'Article', headline: 'How to make your project a fun hobby that pays you', url: `${SITE_URL}/blog/interview-mariia-lukianova` },
  },
  {
    path: '/thank-you',
    title: 'Thank You - Your Download is Ready | 12BRAVE',
    description: 'Thank you for your submission. Download your 12BRAVE resource below.',
    ogType: 'website',
  },
  {
    path: '/privacy-policy---12brave',
    title: 'Privacy Policy - 12BRAVE',
    description: 'Privacy Policy for the 12BRAVE entrepreneurship program. Learn how we collect, use, and protect your personal data.',
    ogTitle: 'Privacy Policy - 12BRAVE',
    ogDescription: 'How 12BRAVE collects, uses, and protects your personal data.',
    ogType: 'website',
  },
  {
    path: '/terms',
    title: 'Terms & Conditions | 12BRAVE',
    description: 'Terms and Conditions for the 12BRAVE entrepreneurship program - participation rules, refund policy, intellectual property, and data handling.',
    ogTitle: 'Terms & Conditions - 12BRAVE',
    ogDescription: 'Participation rules, refund policy, and terms for the 12BRAVE program.',
    ogType: 'website',
  },
  {
    path: '/topplatforms',
    title: '5K Guide - Top 50 Platforms to Earn Your First 5K | 12BRAVE',
    description: 'Download the free Top 50 Platforms List from 12BRAVE - curated platforms to help you earn your first 5,000 euros from a side project.',
    ogTitle: 'Free Guide: Top 50 Platforms to Earn Your First 5K',
    ogDescription: "Download 12BRAVE's curated list of 50 platforms to start earning from your side project.",
    ogType: 'website',
    ogImage: OG_IMAGE,
  },
  {
    path: '/download/guide',
    title: 'Download Your Guide | 12BRAVE',
    description: 'Download the 12BRAVE guide - How to Make 5K Euro from Your Own Project in 12 Weeks.',
    ogType: 'website',
  },
  {
    path: '/download/program',
    title: 'Download Program Curriculum | 12BRAVE',
    description: 'Download the 12BRAVE program curriculum - a 12-week entrepreneurship course for working professionals.',
    ogType: 'website',
  },
]

// Read the base index.html template
const template = readFileSync(join(DIST, 'index.html'), 'utf-8')

let count = 0
for (const page of pages) {
  const url = `${SITE_URL}${page.path}`
  const ogTitle = page.ogTitle || page.title
  const ogDesc = page.ogDescription || page.description

  // Build meta tags block
  const metaTags = [
    `<title>${page.title}</title>`,
    `<meta name="description" content="${page.description}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:title" content="${ogTitle}" />`,
    `<meta property="og:description" content="${ogDesc}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:type" content="${page.ogType || 'website'}" />`,
    `<meta property="og:site_name" content="12BRAVE" />`,
    page.ogImage ? `<meta property="og:image" content="${page.ogImage}" />` : '',
    `<meta name="twitter:card" content="${page.ogImage ? 'summary_large_image' : 'summary'}" />`,
    `<meta name="twitter:title" content="${ogTitle}" />`,
    `<meta name="twitter:description" content="${ogDesc}" />`,
    page.ogImage ? `<meta name="twitter:image" content="${page.ogImage}" />` : '',
    page.jsonLd ? `<script type="application/ld+json">${JSON.stringify(page.jsonLd)}</script>` : '',
  ].filter(Boolean).join('\n    ')

  // Replace the generic <title> and inject meta tags before </head>
  let html = template.replace(
    '<title>12BRAVE</title>',
    metaTags
  )

  // Determine output path
  let outDir, outFile
  if (page.path === '/') {
    outDir = DIST
    outFile = join(DIST, 'index.html')
  } else {
    // /about-us -> dist/about-us/index.html
    outDir = join(DIST, ...page.path.split('/').filter(Boolean))
    outFile = join(outDir, 'index.html')
  }

  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true })
  }
  writeFileSync(outFile, html, 'utf-8')
  count++
}

console.log(`inject-meta: generated ${count} pages with static SEO tags`)
