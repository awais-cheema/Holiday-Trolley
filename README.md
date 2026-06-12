# Holiday Trolley — Static HTML/CSS/JS

A plain **HTML + CSS + JavaScript** build of the original React/Vite app. No build step, no Node, no framework — open `index.html` or drop the folder on any static host (Vercel, Netlify, GitHub Pages, etc.).

## Structure

```
holiday-trolley-static/
├── index.html      # full page markup (header, hero, sections, footer, modals)
├── styles.css      # the exact compiled stylesheet from the original app
├── script.js       # vanilla JS for every interaction
├── Logo.webp
├── favicon.png
├── trustpilot.png
├── Hero Imgs/      # hero slider backgrounds
├── Destinations/   # trending destination images
├── Holiday Types/  # holiday-type card images
├── Hotels/         # hotel partner logos
└── Airlines/       # airline partner logos
```

## Interactions ported to vanilla JS

- **Hero slider** — auto-advances every 2s, prev/next arrows, ← → keyboard nav, crossfade
- **Top Holidays** & **Holidays By Type** — horizontal carousels with arrow scrolling
- **Partner rows** — looping autoplay (3s) for hotel + airline logos
- **FAQ** — single-open accordion
- **Header** — switches to compact/blurred state on scroll
- **Mobile menu** — hamburger drawer
- **Search box** — focus-driven suggestions dropdown with live filtering
- **Modals** — Enquiry, Contact, Holiday Detail, Shortlist (open/close, backdrop + Esc)

## Running locally

It's fully static, so any of these work:

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .
```

Then visit `http://localhost:8000`.

## Notes

- Two images stay remote because the original app references them remotely too:
  the navy "Luxury Kenya Safari & Zanzibar" photo and the "We Plant a Tree" banner.
- Holiday cards open a representative detail modal. If you want each card to open
  its own package data, that can be wired up from the original `data.ts`.
