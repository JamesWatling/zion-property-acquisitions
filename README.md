# Zion Property Acquisitions — website

Single-page marketing/credibility site. One self-contained file: `index.html` (HTML + CSS + a line of JS, Google Fonts via CDN). No build step.

## Before going live — update these placeholders
In `index.html`, replace:
- **Phone:** `(435) 215-0000` (appears in the contact buttons, `tel:+14352150000`, and footer)
- **Email:** `info@zionpropertyacquisitions.com` (contact button, form `action`, footer) — set up this inbox once the domain is registered
- **(Optional)** swap the `mailto:` form for a real form endpoint (Formspree/Vercel form) so submissions don't open the visitor's mail client

## To-do to launch
1. **Register the domain:** ZionPropertyAcquisitions.com (confirmed available).
2. **Form the LLC:** verify "Zion Property Acquisitions, LLC" is available at corporations.utah.gov, then file.
3. **Email:** create info@zionpropertyacquisitions.com (Google Workspace or your registrar's email).
4. **Deploy** (any static host):
   - **Vercel:** `vercel --prod` from this folder (or import the repo at vercel.com).
   - **Netlify / Cloudflare Pages / GitHub Pages:** drag-and-drop or point at this folder.
5. Point the domain's DNS at the host.

## Notes
- Mobile-responsive; works offline except the web font (which falls back to Georgia/Inter-system).
- `preview-hero.png` / `preview-full.png` are reference screenshots (safe to delete).
- Disclaimer in the footer positions the company as a **principal buyer**, not a licensed brokerage — keep it.
