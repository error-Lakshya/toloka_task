/**
 * SEO configuration for all 11 pages.
 * Includes title, description, OG tags, Twitter cards, and JSON-LD schema.
 */

const OG_IMAGE = 'https://cdn.prod.website-files.com/687fa761be60df02646a1dc0/68d0378c1ed599b79a0398c6_Screenshot%202025-09-21%20193552.png'
const SITE_URL = 'https://12brave.com'

export interface PageSEO {
  title: string
  description: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogType?: string
  twitterCard?: string
  noindex?: boolean
  jsonLd?: Record<string, unknown>
}

export const SEO_MAP: Record<string, PageSEO> = {
  '/': {
    title: 'Side Business Course for Professionals | 12BRAVE Program',
    description: 'Start your side business without quitting your job. 12BRAVE: 12-week entrepreneurship program for European professionals. Mentoring, community, real results.',
    ogTitle: '12BRAVE: Side Business Program for Working Professionals',
    ogDescription: 'Join 12BRAVE - the entrepreneurship program helping European professionals start successful side businesses while working full-time.',
    ogImage: OG_IMAGE,
    ogType: 'website',
    twitterCard: 'summary_large_image',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: '12BRAVE',
      url: SITE_URL,
      logo: 'https://cdn.prod.website-files.com/687fa761be60df02646a1dc0/68a72d4866512a31c8d5bc0b_Frame%201948756480.svg',
      description: 'Start your side business without quitting your job. 12BRAVE: 12-week entrepreneurship program for European professionals.',
      sameAs: ['https://www.linkedin.com/company/12brave/'],
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'team@12brave.com',
        contactType: 'customer service',
      },
      offers: {
        '@type': 'Offer',
        name: '12BRAVE 12-Week Entrepreneurship Program',
        description: '12-week side business course with mentoring, community, and real results for European professionals.',
        availability: 'https://schema.org/InStock',
      },
    },
  },
  '/about-us': {
    title: 'About us | 12BRAVE',
    description: 'Meet the founders of 12BRAVE - former corporate managers helping European professionals launch side businesses in 12 weeks with mentoring and community support.',
    ogTitle: 'About 12BRAVE - Our Story & Founders',
    ogDescription: 'Meet Ekaterina and Victoria, former corporate managers who created 12BRAVE to help European professionals start side businesses.',
    ogImage: OG_IMAGE,
    ogType: 'website',
    twitterCard: 'summary_large_image',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About 12BRAVE',
      url: `${SITE_URL}/about-us`,
      description: 'Meet the founders of 12BRAVE - former corporate managers helping European professionals launch side businesses.',
      mainEntity: {
        '@type': 'EducationalOrganization',
        name: '12BRAVE',
        url: SITE_URL,
      },
    },
  },
  '/blog': {
    title: 'Blog | 12BRAVE',
    description: '12BRAVE blog - interviews with founders and mentors, case studies, and practical resources for aspiring side-business founders in Europe.',
    ogTitle: '12BRAVE Blog - Stories & Resources for Side-Business Founders',
    ogDescription: 'Interviews, case studies, and practical resources from the 12BRAVE entrepreneurship community.',
    ogImage: OG_IMAGE,
    ogType: 'website',
    twitterCard: 'summary_large_image',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: '12BRAVE Blog',
      url: `${SITE_URL}/blog`,
      description: 'Interviews, case studies, and resources for aspiring side-business founders.',
      publisher: {
        '@type': 'Organization',
        name: '12BRAVE',
        url: SITE_URL,
      },
    },
  },
  '/blog/founders-of-12brave-interview': {
    title: 'Founders of 12BRAVE: "We wanted to create a real impact" | 12BRAVE',
    description: 'Interview with Ekaterina and Victoria, co-founders of 12BRAVE, on why they left corporate careers to build an entrepreneurship program for professionals across Europe.',
    ogTitle: 'Founders of 12BRAVE: "We wanted to create a real impact"',
    ogDescription: 'Interview with the co-founders of 12BRAVE on leaving corporate careers to help European professionals start side businesses.',
    ogImage: OG_IMAGE,
    ogType: 'article',
    twitterCard: 'summary_large_image',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Founders of 12BRAVE: "We wanted to create a real impact"',
      url: `${SITE_URL}/blog/founders-of-12brave-interview`,
      description: 'Interview with the co-founders of 12BRAVE about their journey from corporate to entrepreneurship education.',
      publisher: {
        '@type': 'Organization',
        name: '12BRAVE',
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: 'https://cdn.prod.website-files.com/687fa761be60df02646a1dc0/68a72d4866512a31c8d5bc0b_Frame%201948756480.svg',
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/blog/founders-of-12brave-interview`,
      },
    },
  },
  '/blog/interview-mariia-lukianova': {
    title: 'How to make your project a fun hobby that pays you - Mariia Lukianova | 12BRAVE',
    description: 'From corporate R&D to charity and startup fundraising - 12BRAVE mentor Mariia Lukianova on turning a side project into a rewarding hobby that generates income.',
    ogTitle: 'How to make your project a fun hobby that pays you - Mariia Lukianova',
    ogDescription: '12BRAVE mentor Mariia Lukianova shares how she transitioned from corporate R&D to building projects that create real impact.',
    ogImage: OG_IMAGE,
    ogType: 'article',
    twitterCard: 'summary_large_image',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'How to make your project a fun hobby that pays you',
      url: `${SITE_URL}/blog/interview-mariia-lukianova`,
      description: '12BRAVE mentor Mariia Lukianova on transitioning from corporate R&D to building impactful side projects.',
      author: {
        '@type': 'Person',
        name: 'Mariia Lukianova',
      },
      publisher: {
        '@type': 'Organization',
        name: '12BRAVE',
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: 'https://cdn.prod.website-files.com/687fa761be60df02646a1dc0/68a72d4866512a31c8d5bc0b_Frame%201948756480.svg',
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/blog/interview-mariia-lukianova`,
      },
    },
  },
  '/thank-you': {
    title: 'Thank You - Your Download is Ready | 12BRAVE',
    description: 'Thank you for your submission. Download your 12BRAVE resource below.',
    ogType: 'website',
    twitterCard: 'summary',
  },
  '/privacy-policy---12brave': {
    title: 'Privacy Policy - 12BRAVE',
    description: 'Privacy Policy for the 12BRAVE entrepreneurship program. Learn how we collect, use, and protect your personal data.',
    ogTitle: 'Privacy Policy - 12BRAVE',
    ogDescription: 'How 12BRAVE collects, uses, and protects your personal data.',
    ogType: 'website',
    twitterCard: 'summary',
  },
  '/terms': {
    title: 'Terms & Conditions | 12BRAVE',
    description: 'Terms and Conditions for the 12BRAVE entrepreneurship program - participation rules, refund policy, intellectual property, and data handling.',
    ogTitle: 'Terms & Conditions - 12BRAVE',
    ogDescription: 'Participation rules, refund policy, and terms for the 12BRAVE program.',
    ogType: 'website',
    twitterCard: 'summary',
  },
  '/topplatforms': {
    title: '5K Guide - Top 50 Platforms to Earn Your First 5K | 12BRAVE',
    description: 'Download the free Top 50 Platforms List from 12BRAVE - curated platforms to help you earn your first 5,000 euros from a side project.',
    ogTitle: 'Free Guide: Top 50 Platforms to Earn Your First 5K',
    ogDescription: "Download 12BRAVE's curated list of 50 platforms to start earning from your side project.",
    ogImage: OG_IMAGE,
    ogType: 'website',
    twitterCard: 'summary_large_image',
  },
  '/download/guide': {
    title: 'Download Your Guide | 12BRAVE',
    description: 'Download the 12BRAVE guide - How to Make 5K Euro from Your Own Project in 12 Weeks.',
    ogType: 'website',
    twitterCard: 'summary',
  },
  '/download/program': {
    title: 'Download Program Curriculum | 12BRAVE',
    description: 'Download the 12BRAVE program curriculum - a 12-week entrepreneurship course for working professionals.',
    ogType: 'website',
    twitterCard: 'summary',
  },
}

export const PAGE_MAP: Record<string, string> = {
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
