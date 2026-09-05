# Ishmam — Portfolio (redesign)

A premium, cinematic rebuild of the portfolio site: same stack (plain HTML/CSS/JS +
GSAP for a few scroll-tied moments), no build step, no framework — still just
`index.html`, `resume.html`, `css/style.css`, `js/main.js`, and `img/`.

Open `index.html` directly in a browser, or serve the folder with any static
host (GitHub Pages, Netlify, Vercel, etc).

---

## What changed

- **About** — the avatar + separate photo strip were replaced with one
  cinematic crossfade carousel (arrows, dots, swipe, keyboard, slow autoplay
  that pauses on hover/focus and turns off for `prefers-reduced-motion`).
  `profile-square-3.jpg` is the primary/first photo, as requested.
- **Selected work** — rebuilt around a single data array instead of hand‑written
  markup per project (see **Adding new work**, below). Four tabs:
  - **All work** — an editorial collage (mixed card sizes, not a uniform grid).
  - **Videography** — a draggable, snap-scrolling 16:9 "cinema reel." The
    centred film is highlighted; neighbours peek at the edges. Arrow buttons,
    drag-to-scroll, and arrow-key support all work.
  - **Photography** — a horizontal frame-strip-track. No dedicated photography
    set shipped in the original project, so this currently renders an honest
    "coming soon" card rather than relabelling personal photos as client work.
    Drop real items into `PORTFOLIO.photography` in `js/main.js` and they'll
    replace it automatically.
  - **Design** — a horizontal frame-strip-track combining the five titled
    poster/thumbnail pieces and the 23-piece poster series.
- **Contact form** — added phone / project type / preferred-contact fields,
  a honeypot field for basic spam filtering, and proper loading / success /
  error states. Wired to [Formspree](https://formspree.io) — see **Configure
  the contact form** below, it will not send anywhere until you do this.
- **Images** — the `img/Design` folder was 124MB of 4861×6250px source files
  (some 15MB each). It's been replaced with `img/design/`, a web-optimized
  set (~3MB total, capped at 1400px on the long edge) so the Design strip
  doesn't tank page performance. Same treatment for the oversized hero photo.
  Keep your originals wherever you archive source files — they aren't needed
  by the site itself.
- **SEO** — added a Person JSON-LD block, absolute Open Graph/Twitter image
  URLs, and a theme-color meta tag. Existing meta description/canonical/OG
  tags were kept and lightly extended.
- Removed the old `.filter-row` / `.work-grid` grid system and the unused
  frame-strip markup now that the tabbed system replaces both.

Everything else — nav, hero, statement, marquee, skills, timeline, services,
footer, lightbox, theme toggle, magnetic buttons, reduced-motion handling —
is the same system as before, extended rather than replaced.

---

## Adding new work

Open `js/main.js` and find the `PORTFOLIO` object near the top of the file.
Each entry looks like this:

```js
{
  id: "the-choice",              // unique, used internally
  title: "The Choice",
  category: "Videography",       // shown as a fallback label
  tag: "Short film",              // shown instead of category, if present
  image: "img/the-choice.jpg",
  link: "https://youtu.be/...",   // external link (video) — omit for lightbox items
  linkLabel: "Watch on YouTube",  // currently unused by markup, kept for future use
  description: "...",             // shown only in the videography reel
  date: "2025"
}
```

- Put new **films** in `PORTFOLIO.videography`.
- Put new **photography** in `PORTFOLIO.photography` (same shape as `design`
  items below) — the "coming soon" placeholder disappears automatically once
  this array isn't empty.
- Put new **titled design pieces** (posters, thumbnails, campaigns) in
  `PORTFOLIO.design`, with `lightbox: true` and a `caption` instead of `link`.
- The numbered poster series lives in `PORTFOLIO.designSeries` and is
  generated from `img/design/1.jpg … 23.jpg` automatically — rename the
  `title`/`caption` text in that loop if you'd rather give them real titles
  than "Poster series — 01," etc.

No HTML needs to change, and no other JS needs to change — the tabs, counts,
the reel, the frame strips, and the "All work" collage all read from this
one object.

---

## Configure the contact form

The form posts to Formspree, a hosted form backend that works from static
hosting with no server of your own (free tier: 50 submissions/month).

1. Create a free account at **formspree.io** and add a new form.
2. Copy the form endpoint it gives you — looks like
   `https://formspree.io/f/abcdwxyz`.
3. In `index.html`, find the `<form id="contactForm" ...>` tag and replace
   `https://formspree.io/f/YOUR_FORM_ID` with your real endpoint.
4. Confirm the form once via the confirmation email Formspree sends after
   your first test submission.

Until step 3 is done, submitting the form shows a clear inline message
("Contact form isn't configured yet…") instead of pretending to send —
intentionally, so you don't lose a real message believing it went through.

If you'd rather use a different provider (Netlify Forms, Getform, your own
serverless function, etc.), the JS only needs the form's own `action` URL —
nothing else in `js/main.js` is Formspree-specific.

---

## Before you deploy

- [ ] Set the real Formspree endpoint (above).
- [ ] Add real photography work, or leave the "coming soon" state — both are
      fine, just decide.
- [ ] Rename the 23 `designSeries` placeholder titles if you want real names
      instead of "Poster series — NN."
- [ ] Double check `canonical`, `og:url`, and the JSON-LD `url` in
      `index.html`/`resume.html` match your actual deployed domain.
- [ ] If you regenerate or add images, keep new Design-folder-style photos
      under ~1400px / ~200KB each — see `img/design/` for the target.

---

## File structure

```
index.html          Home page
resume.html          Resume page (shares css/js with home)
css/style.css        Single stylesheet — design tokens at the top (:root)
js/main.js           All interactivity + the PORTFOLIO data array
img/
  design/            Web-optimized poster series (1.jpg … 23.jpg)
  portfolio/          Titled poster/thumbnail/campaign pieces
  personal/           Candid photos used in the About carousel
  profile/            Headshots (profile-square-3.jpg is primary)
  the-choice.jpg, life.jpg   Videography posters
```
