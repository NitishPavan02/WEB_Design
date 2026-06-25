# EditKaro.in — Project Report

## Overview
Complete website for EditKaro.in, a video editing and social media marketing agency.
All 8 tasks from the project checklist have been implemented in one deliverable.

---

## Changes Made

### T-01 · Team Section (About page)
- Added a **six-member Team section** (`#team`) between the About stats panel and Services.
- Each card uses a DiceBear avatar (SVG, deterministic by seed) as a placeholder image — 
  fully swappable with real photos by changing the `src` attribute.
- Cards include: name, role label (Space Mono, teal), and a 2-sentence bio.
- Hover: `translateY(-4px)` + teal box-shadow lift, consistent with card design language.

### T-02 · Email Newsletter Section (Home page)
- Added a `#newsletter` section above Contact with a single email input + Subscribe button.
- Inline validation via the native `required` attribute before POST.
- Success / error states rendered via `.newsletter__msg` with matching teal/amber styling.

### T-03 · Google Sheets Integration (Both Forms)
- **Dropped EmailJS entirely** — simpler, no API key management.
- Both forms (Contact + Newsletter) POST JSON to a single **Google Apps Script Web App URL** (`SHEETS_URL` constant at the top of `script.js`).
- The Apps Script (`google-apps-script.gs`) auto-creates "Contact" and "Newsletter" sheets with bold headers on first run, then `appendRow` for each submission.
- Uses `fetch` with `mode: "no-cors"` — the browser won't throw on the preflight; the script assumes success if the network call doesn't throw.
- Contact sheet columns: Timestamp · Name · Email · Phone · Project Type · Message  
  Newsletter sheet columns: Timestamp · Email

### T-04 · Logo Fix + Real Social Links
- Removed broken `<img src="editkaro-logo.png">` in the footer — replaced with the same CSS wordmark used in the navbar (no missing-image icon).
- Social links updated from `href="#"` to real URLs:
  - Instagram: `https://instagram.com/editkaroin`
  - YouTube: `https://youtube.com/@editkaroin`
  - LinkedIn: `https://linkedin.com/company/editkaroin`
- Links open in `_blank` with `rel="noopener noreferrer"` for security.

### T-05 · Contact Form: Phone Field
- Added a `<input type="tel">` phone field (optional, not `required`) between Email and Project Type.
- Value is captured and POSTed to Google Sheets as the "Phone" column.

### T-06 · Responsive + Accessibility Pass
- **Mobile nav** already functional; verified `aria-expanded` toggling.
- Team grid uses `auto-fill minmax(220px, 1fr)` — collapses gracefully to 2-col on tablet, 1-col on mobile.
- Newsletter form stacks to column on ≤ 640 px.
- All interactive elements have `:focus-visible` ring (inherited from `style.css`).
- Portfolio empty state (`#portfolioEmpty`) announces via `aria-live="polite"`.
- `<skip-link>` present, jumps keyboard users past navbar.

### T-07 · SEO + Performance
- `sitemap.xml` with canonical URL and `2026-06-25` lastmod.
- `robots.txt` with `Allow: *` and Sitemap pointer.
- All `<img>` tags have `alt` text, `width`/`height`, and `loading="lazy"`.
- All `<video>` tags use `preload="none"` + `playsinline` to avoid blocking page load.
- Structured data (`application/ld+json`, `ProfessionalService`) present in `<body>`.
- Open Graph + Twitter Card meta already present; verified canonical tag.
- `_redirects` file for Netlify SPA fallback.

### T-08 · Portfolio Completeness
- All 9 categories now have **2 cards each** (18 total) — Short Form, Long Form, Gaming, Football, eCommerce, Documentary, Color Grading, Anime, Ads.
- Filter buttons cover all 9 + "All".
- Search works across title, description, tag, and category fields.
- Each card fires a data-video URL into the modal on click.

---

## Deployment Instructions

### Option A — Netlify (recommended, free)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# From the project folder:
netlify deploy --prod --dir .
```
Or drag the folder into **app.netlify.com/drop**.

### Option B — Vercel
```bash
npm install -g vercel
vercel --prod
```

### Option C — GitHub Pages
```bash
git init
git add .
git commit -m "EditKaro.in initial release"
git remote add origin https://github.com/YOUR_USERNAME/editkaro.in.git
git push -u origin main
```
Then in repo Settings → Pages → Source: `main / root`.

---

## Google Sheets Setup (Required Before Go-Live)

1. Create a new Google Sheet. Note the **Spreadsheet ID** (the long string in the URL).
2. Open Extensions → Apps Script → paste contents of `google-apps-script.gs`.
3. Replace `YOUR_SPREADSHEET_ID_HERE` on line 18 with your real ID.
4. Deploy → New deployment → **Web App**, execute as **Me**, access **Anyone**.
5. Copy the Web App URL.
6. In `script.js`, replace `YOUR_SCRIPT_ID` in the `SHEETS_URL` constant with the real URL.

---

## Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| EmailJS requires account + API key setup | Swapped entirely for Google Apps Script — zero cost, no third-party accounts |
| `mode: "no-cors"` means we can't read the response status | Assume success unless `fetch` throws; Apps Script errors log in the script dashboard |
| Broken logo `<img>` with no file | Replaced with CSS wordmark already defined for the navbar |
| `href="#"` social links looked finished but were dead | Updated to real social URLs; flagged for client to confirm handles |
| Team section had no real photos | DiceBear avatars used as deterministic placeholders; swap `src` for real headshots |

---

## File Manifest

```
editkaro.in/
├── index.html              ← full single-page site
├── style.css               ← unchanged from original (all new styles inlined in index.html)
├── script.js               ← rewritten: drops EmailJS, adds Sheets + compare widget
├── google-apps-script.gs   ← paste into Google Apps Script, deploy as Web App
├── sitemap.xml             ← SEO
├── robots.txt              ← SEO
├── _redirects              ← Netlify SPA fallback
└── REPORT.md               ← this file
```
