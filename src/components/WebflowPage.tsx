import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { submitForm } from '../lib/formHandler'

interface Props {
  htmlFile: string
  title: string
  description: string
}

export default function WebflowPage({ htmlFile, title, description }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [html, setHtml] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  // Fetch HTML content
  useEffect(() => {
    setLoading(true)
    fetch(htmlFile)
      .then((res) => res.text())
      .then((text) => {
        setHtml(text)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [htmlFile])

  // Set document title and meta description
  useEffect(() => {
    document.title = title

    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute('content', description)

    // Set canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', `https://12brave.com${location.pathname}`)
  }, [title, description, location.pathname])

  // Intercept internal links for SPA navigation + handle form submissions
  useEffect(() => {
    const container = containerRef.current
    if (!container || !html) return

    // SPA link interception
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href) return

      // Skip external links, anchors, and special protocols
      if (
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#')
      ) {
        return
      }

      // Internal link — use React Router
      e.preventDefault()
      navigate(href)
    }

    // Form submission interception
    const handleSubmit = async (e: Event) => {
      const form = e.target as HTMLFormElement
      if (!form || form.tagName !== 'FORM') return

      e.preventDefault()

      const formData = new FormData(form)
      const formName = form.getAttribute('data-name') || form.getAttribute('name') || 'unknown'
      const data: Record<string, string> = {}
      formData.forEach((value, key) => {
        data[key] = value.toString()
      })
      data['_form_name'] = formName
      data['_page_url'] = window.location.href

      // Show loading state
      const submitBtn = form.querySelector('input[type="submit"]') as HTMLInputElement
      const originalValue = submitBtn?.value
      if (submitBtn) submitBtn.value = 'Please wait...'

      try {
        await submitForm(data)

        // Show success message (Webflow-style)
        const successDiv = form.parentElement?.querySelector('.w-form-done') as HTMLElement
        const failDiv = form.parentElement?.querySelector('.w-form-fail') as HTMLElement
        if (successDiv) {
          form.style.display = 'none'
          successDiv.style.display = 'block'
        }
        if (failDiv) failDiv.style.display = 'none'

        // Check if this form should redirect
        if (formName === 'wf-form-popup-download-program') {
          setTimeout(() => navigate('/download/program'), 1500)
        } else if (formName === 'wf-form-popup-download-5kguide') {
          setTimeout(() => navigate('/download/guide'), 1500)
        }
      } catch {
        // Show error message
        const successDiv = form.parentElement?.querySelector('.w-form-done') as HTMLElement
        const failDiv = form.parentElement?.querySelector('.w-form-fail') as HTMLElement
        if (successDiv) successDiv.style.display = 'none'
        if (failDiv) failDiv.style.display = 'block'
        if (submitBtn) submitBtn.value = originalValue || 'Submit'
      }
    }

    container.addEventListener('click', handleClick)
    container.addEventListener('submit', handleSubmit)

    // Execute inline <script> tags that dangerouslySetInnerHTML doesn't run
    const scripts = container.querySelectorAll('script')
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script')
      // Copy attributes
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value)
      })
      // Copy inline content
      if (oldScript.textContent) {
        newScript.textContent = oldScript.textContent
      }
      oldScript.parentNode?.replaceChild(newScript, oldScript)
    })

    // Re-initialize Webflow interactions after content loads
    try {
      // @ts-expect-error Webflow global
      if (window.Webflow) window.Webflow.ready()
    } catch {
      // Webflow runtime not loaded yet — OK
    }

    return () => {
      container.removeEventListener('click', handleClick)
      container.removeEventListener('submit', handleSubmit)
    }
  }, [html, navigate])

  // Scroll to top on page change, handle hash anchors
  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1))
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [location])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ fontSize: '1.2rem', color: '#666' }}>Loading...</div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
