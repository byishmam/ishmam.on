# Ishmam — Premium Portfolio Rebuild

A ground-up visual and technical rebuild of the original Bootstrap/jQuery-era
site, built on the same content and information architecture but with a new
design system, real animation, and a working contact form. Static HTML/CSS/JS
— no build step. Deploys to GitHub Pages exactly like the original.

## How to preview locally
```
cd site
python3 -m http.server 8000
# open http://localhost:8000
```

## What changed and why

**Kept, unchanged in substance**
- All real content: bio, philosophy, resume history, education, certifications,
  the three actual portfolio pieces (The Choice, Life hits hard…, the
  referendum campaign), all six testimonials, and the campaign case-study
  article text.
- The Formspree contact endpoint (`f/xgoagazp`) — it was already wired up and
  working, so the new form posts to the same place.
- All social links, email addresses, phone numbers, and the CV download link.

**Rebuilt**
- Full visual design: a new ink/paper/brass design system, system-font
  display type for English, Hind Siliguri for Bangla, dark/light mode with a
  toggle that respects OS preference and remembers your choice.
- All animation: scroll reveals, a hero text stagger, a dependency-free typed
  role loop, magnetic buttons, a lightweight custom lightbox, smooth scroll —
  replacing Bootstrap, jQuery-era AOS/AOS.js, Isotope, GLightbox, Swiper,
  Waypoints and PureCounter with about 1/6th the code and no jQuery.
- The contact form: real inline validation (name/email/subject/message),
  loading/success/error states, and keyboard-accessible fields — same
  Formspree backend as before, but no longer "looks functional and does
  nothing" if JS hiccups.
- Services copy: the original listed generic corporate services (marketing
  strategy, growth acceleration, etc.) that didn't match your actual work.
  Rewritten around what you actually do — creative direction, writing &
  oratory, campaign design, filmmaking, event design, visual/brand design.
- Image assets: recompressed to WebP, cutting total image weight from ~18MB
  to ~3.6MB (the two largest files, at 6.5–7MB each, are now under 100KB with
  no visible quality loss). Several files also had mangled filenames from the
  original zip export; these were renamed to clean, portable slugs.

**Removed**
- `birchattala.html` — unlinked from anywhere live, and its body content was
  unfilled Lorem ipsum placeholder text, not real content.
- `forms/contact.php` — dead code once the form moved fully to Formspree.
- Unused `img/services/*` images that weren't referenced anywhere.
- Bootstrap, Bootstrap Icons, jQuery-era vendor bundle (~1.5MB of JS/CSS) —
  replaced with hand-drawn inline SVG icons and a small custom stylesheet.

**Fixed**
- The full-screen preloader used to be dismissed only by JavaScript; if a
  script failed to load, it would permanently cover the entire site. It now
  hides itself instantly via `<noscript>` and has a 2.5-second CSS-only
  timeout as a backup, verified with JavaScript fully disabled.
- All animated/reveal content is visible by default and only hidden once
  JavaScript is confirmed running — so a slow or blocked script can never
  leave content invisible.
- Removed two dead filter options ("Writings", "Photography") that had no
  matching portfolio items in the original markup.

## Notes for next steps
- The portfolio only shows the three projects that existed for real in the
  original site. Add more `.work-card` blocks in `portfolio.html` (and the
  homepage teaser) as new work comes in — the filter chips will need new
  `data-filter` values to match.
- GSAP, ScrollTrigger and Lenis load from a public CDN (unpkg). Everything
  is written to fail gracefully without them, but for a production deploy
  you may want to vendor them locally for reliability.
