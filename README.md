# EditKaro.in — Video Editing & Social Media Content Studio

> **Edits that stop the scroll.**  
> Premium video editing and social media content studio for creators, brands and businesses.

🌐 **Live site:** [https://editkaro.in](https://editkaro.in)  
📧 **Contact:** hello@editkaro.in  
📸 **Instagram:** [@editkaroin](https://instagram.com/editkaroin)  
▶️ **YouTube:** [@editkaroin](https://youtube.com/@editkaroin)

---

## About

EditKaro is a premium video editing and social media content studio built for creators, brands and businesses that need content that performs. Every project is planned, cut, graded and exported with the platform, the pacing and the audience in mind — from the first frame to the final render.

Whether it's a fifteen-second Reel, a twenty-minute YouTube vlog, a matchday highlight reel or a full advertising campaign, the team handles the timeline so you can focus on what happens in front of the camera.

---

## Services

| # | Service | Description |
|---|---------|-------------|
| 1 | **Short Form Editing** | Fast-cut Reels & Shorts built for the first 3 seconds, with kinetic captions and trend-ready pacing |
| 2 | **Long Form Editing** | Chaptered YouTube videos and podcasts with layered B-roll, clean audio and consistent visual identity |
| 3 | **Gaming Highlights** | Beat-synced montages and stream recaps that turn clutch plays into shareable moments |
| 4 | **Football Edits** | Goal-by-goal highlight packages with broadcast-style graphics, replays and crowd-audio mixing |
| 5 | **eCommerce Ads** | Conversion-focused product edits optimised for paid social and retargeting campaigns |
| 6 | **Documentary Editing** | Observational and interview-driven cuts with natural pacing and ambient sound design |
| 7 | **Color Grading** | Custom LUTs and mood grades applied across full series for one unified, filmic look |
| 8 | **Anime Edits** | Beat-synced AMVs and fan recap cuts with dynamic transitions for fan channels |
| 9 | **Advertisement Production** | Broadcast-ready spots and multi-format social campaigns with motion graphics |

---

## Tech Stack

This is a **vanilla, zero-dependency** static website — no frameworks, no build tools required.

| File | Purpose |
|------|---------|
| `index.html` | Full single-page site with semantic HTML5 and structured data (Schema.org) |
| `style.css` | Custom CSS with design tokens, dark/light theme, responsive layout |
| `script.js` | Vanilla JS — navbar, theme toggle, scroll-reveal, portfolio filter, video modal, before/after slider, form submissions |
| `google-apps-script.gs` | Google Apps Script web app that receives form POST requests and writes to Google Sheets |

### Features

- **Dark / Light theme** — persisted to `localStorage`
- **Animated scroll-reveal** — via `IntersectionObserver`
- **Portfolio filter + search** — live filtering by category and keyword
- **Before / After comparison slider** — drag to compare raw vs graded footage
- **Video lightbox modal** — keyboard accessible, focus-trapped
- **Timecode ticker** — live HH:MM:SS:FF display
- **Animated stat counters** — triggered on scroll
- **Contact form → Google Sheets** — no backend server required
- **Newsletter form → Google Sheets** — no backend server required
- **SEO-ready** — canonical tags, Open Graph, Twitter Card, Schema.org JSON-LD

---

## Google Sheets Integration

Both the Contact form and Newsletter form submit directly to a **Google Apps Script Web App**, which appends rows to a Google Sheet. No server or database is needed.

### Setup

1. Go to [script.google.com](https://script.google.com) and create a new project.
2. Paste the contents of `google-apps-script.gs`.
3. Replace `SPREADSHEET_ID` on line 15 with the ID from your Google Sheet's URL.
4. Click **Deploy → New deployment → Web App**:
   - **Execute as:** Me
   - **Who has access:** Anyone
5. Copy the Web App URL.
6. In `script.js`, set `SHEETS_URL` to that URL.

### Sheets Structure

The script auto-creates sheets with headers if they don't exist:

**Contact sheet**

| Timestamp | Name | Email | Phone | Project Type | Message |
|-----------|------|-------|-------|--------------|---------|

**Newsletter sheet**

| Timestamp | Email |
|-----------|-------|

> ⚠️ Every time you change the Apps Script code, you must deploy a **New Version** (not reuse the existing version number) or Google will serve the cached old code.

---

## Studio Specs

| Spec | Detail |
|------|--------|
| **Formats** | 16:9 · 9:16 · 1:1 |
| **Platforms** | Instagram / YouTube / Facebook / X |
| **Delivery** | Source files + platform-ready exports |
| **Turnaround** | ~48 hours average |
| **Based in** | India · Remote-First |

---

## Project Structure

```
editkaro.in/
├── index.html              # Single-page HTML
├── style.css               # All styles + CSS custom properties
├── script.js               # All interactivity (vanilla JS)
├── google-apps-script.gs   # Apps Script for Google Sheets integration
├── assets/
│   └── images/
│       └── og-image.jpg    # Open Graph / Twitter Card image
└── README.md
```

---

## Running Locally

No build step needed. Just open `index.html` in a browser:

```bash
# Option 1 — open directly
open index.html

# Option 2 — serve with Python
python3 -m http.server 8000
# then visit http://localhost:8000

# Option 3 — serve with Node
npx serve .
```

---

## Deploying

This site is a plain static build and deploys to any static host:

- **GitHub Pages** — push to `main` and enable Pages in repo settings
- **Netlify** — drag and drop the folder, or connect the repo
- **Vercel** — `vercel` CLI or import from GitHub
- **Cloudflare Pages** — connect repo, build command: *(none)*, output: `/`

---

## License

This project is licensed under the **MIT License** — see [LICENSE](./LICENSE) for details.

---

*Built with care, frame by frame. — EditKaro Team*
