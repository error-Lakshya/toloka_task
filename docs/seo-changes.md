# SEO Improvements (Subtask 3)

## Changes Implemented (no customer action needed)

### 1. Canonical Tags — Added to All 11 Pages
Every page now dynamically sets `<link rel="canonical" href="https://12brave.com{path}">`.
Previously missing on all pages.

### 2. Meta Descriptions — Added/Improved for All 11 Pages
Every page now has a unique, keyword-relevant `<meta name="description">`.
Previously missing on 8 of 11 pages.

### 3. Open Graph Tags — Added to All 11 Pages
Each page now sets:
- `og:title` (unique per page)
- `og:description` (unique per page)
- `og:url` (canonical URL)
- `og:type` (`website` for static pages, `article` for blog posts)
- `og:site_name` (`12BRAVE`)
- `og:image` (shared hero image — homepage only had this before)

### 4. Twitter Card Tags — Added to All 11 Pages
Each page now sets:
- `twitter:card` (`summary_large_image` for content pages, `summary` for utility pages)
- `twitter:title`
- `twitter:description`
- `twitter:image`

### 5. JSON-LD Schema Markup — Added to Key Pages
- `/` — `EducationalOrganization` schema with offers, contact, social links
- `/about-us` — `AboutPage` schema
- `/blog` — `Blog` schema with publisher
- `/blog/founders-of-12brave-interview` — `Article` schema with publisher
- `/blog/interview-mariia-lukianova` — `Article` schema with author + publisher

### 6. Robots Meta — Utility Pages Set to noindex
- `/thank-you`, `/download/guide`, `/download/program` now have `<meta name="robots" content="noindex, nofollow">`
- Prevents search engines from indexing post-submission confirmation pages

### 7. GA4 Double-Loading Fixed
- Removed duplicate direct `gtag.js` snippet (was on all pages in original Webflow site)
- GA4 now fires only via GTM, eliminating double-counted pageviews

---

## Items NOT Changed (preserve design — no visual modifications)

### H1 Tag Issues (document only, do not fix)
These exist in the original Webflow markup. Fixing them would require changing the HTML structure, which could alter the visual layout:

| Page | Issue |
|------|-------|
| `/blog` | 0 H1 tags (the page heading uses a different tag) |
| `/thank-you` | 0 H1 tags |
| `/terms` | 2 H1 tags (should be 1) |

**Recommendation:** Fix these in a future design iteration, not during migration.

---

## Customer Action Required

### 1. DNS / Domain Configuration
After Lovable deployment, the customer must:
- Point `12brave.com` DNS to Lovable hosting
- OR set up a 301 redirect from old Webflow hosting to Lovable
- Ensure both `12brave.com` and `www.12brave.com` resolve correctly
- **Verify:** No existing 301 redirects in Webflow Dashboard → Hosting → Redirects need to be replicated

### 2. GTM Container Verification
The customer should verify that `GTM-W3VKWVWC` has a GA4 tag configured for `G-4C5K7RZ19Q` inside the GTM container. Since we removed the direct `gtag.js` snippet to prevent double-loading, GA4 now depends entirely on GTM.

**How to verify:**
1. Log into https://tagmanager.google.com
2. Open container `GTM-W3VKWVWC`
3. Confirm there is a "Google Analytics: GA4 Configuration" tag with measurement ID `G-4C5K7RZ19Q`
4. If missing, create one and publish

### 3. Google Search Console
After DNS switch:
1. Verify the property `12brave.com` in Google Search Console
2. Submit the sitemap: `https://12brave.com/sitemap.xml`
3. Request indexing of all 11 URLs

### 4. Webflow CDN Asset Migration (future risk)
All images and PDFs still load from `cdn.prod.website-files.com`. If Webflow hosting is discontinued or the Webflow project is deleted, these URLs will break.

**Mitigation (when ready):**
- Download all images and PDFs from the Webflow CDN
- Re-host them on the new platform (Lovable/Vercel/Netlify storage or a CDN like Cloudflare R2)
- Update the HTML files in `public/html/` to reference the new URLs
