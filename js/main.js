/* ==========================================================================
   Ishmam — Portfolio interactions
   Vanilla JS. GSAP + ScrollTrigger (loaded via CDN) are used only where they
   add genuine value (hero reveal, scroll-tied motion); everything else works
   fully without them. Respects prefers-reduced-motion throughout.
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGSAP = typeof window.gsap !== "undefined";
  if (hasGSAP && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ========================================================================
     PORTFOLIO DATA
     Add new work here — nothing else in this file needs to change. Every
     item accepts: id, title, titleClass, category, tag, image, date,
     description, link, linkLabel, lightbox (true = open image in the
     lightbox instead of following the link), caption, video (optional,
     reserved for a future embedded player).
     ==================================================================== */
  var PORTFOLIO = {
    videography: [
      {
        id: "the-choice",
        title: "The Choice",
        category: "Videography",
        tag: "Short film",
        image: "img/the-choice.jpg",
        link: "https://youtu.be/nZl9mT4sKm4?si=ifDdDofWjgIP6408",
        linkLabel: "Watch on YouTube",
        description: "Bangladesh's next four years are in your hands — a short civic film shot in the run-up to a national vote.",
        date: "2025"
      },
      {
        id: "life-hits-hard",
        title: "Life hits hard, but the soul hits harder",
        category: "Videography",
        tag: "Short film",
        image: "img/life.jpg",
        link: "https://fb.watch/EZRZ-vRj0U/",
        linkLabel: "Watch on Facebook",
        description: "A short meditation on resilience — grief, weather and the quiet decision to keep going anyway.",
        date: "2025"
      }
    ],

    design: [
      {
        id: "campaign-referendum",
        title: "গণভোটে হ্যাঁ দিন!",
        titleClass: "bn",
        category: "Campaign",
        tag: "Awareness campaign",
        image: "img/portfolio/campaign-referendum.jpg",
        lightbox: true,
        caption: "গণভোটে হ্যাঁ দিন! — a referendum awareness campaign",
        description: "A referendum awareness campaign built to travel — bold type, one message, shareable at a glance.",
        date: "2025"
      },
      {
        id: "lost-in-you",
        title: "Lost In You",
        category: "Design",
        tag: "Poster design",
        image: "img/portfolio/lost-in-you.jpg",
        lightbox: true,
        caption: "Lost In You — feature poster design",
        description: "Feature poster design for an independent short.",
        date: "2024"
      },
      {
        id: "cinematic-street",
        title: "Cinematic Street",
        category: "Design",
        tag: "Thumbnail design",
        image: "img/portfolio/cinematic-street.jpg",
        lightbox: true,
        caption: "Cinematic Street — YouTube thumbnail design",
        description: "Thumbnail design for a street-cinematography video essay.",
        date: "2024"
      },
      {
        id: "analog-meets-ai",
        title: "Analog Meets AI",
        category: "Design",
        tag: "Thumbnail design",
        image: "img/portfolio/analog-meets-ai.jpg",
        lightbox: true,
        caption: "Analog Meets AI — short movie thumbnail",
        description: "Thumbnail design exploring the tension between analog texture and AI-generated imagery.",
        date: "2024"
      },
      {
        id: "late-night-vibe",
        title: "Late Night Vibe",
        category: "Design",
        tag: "Cover design",
        image: "img/portfolio/late-night-vibe.jpg",
        lightbox: true,
        caption: "Late Night Vibe — chill playlist cover design",
        description: "Playlist cover design for a late-night, low-tempo mix.",
        date: "2023"
      }
    ],

    // Raw poster set — img/design/1.jpg … 23.jpg. Titles are placeholders;
    // rename freely, the strip just reads this array in order.
    designSeries: (function () {
      var items = [];
      for (var i = 1; i <= 23; i++) {
        items.push({
          id: "design-" + i,
          title: "Poster series — " + String(i).padStart(2, "0"),
          category: "Design",
          tag: "Graphic design",
          image: "img/design/" + i + ".jpg",
          lightbox: true,
          caption: "Poster series — " + String(i).padStart(2, "0"),
          date: ""
        });
      }
      return items;
    })(),

    // No dedicated photography set shipped with this project yet — the
    // strip below renders an honest "coming soon" placeholder instead of
    // relabelling personal photos as client work. Add real items here
    // (same shape as `design`, above) and they'll appear automatically.
    photography: []
  };

  /* ------------------------------- helpers -------------------------------- */
  function el(tag, attrs, html) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (attrs[k] === null || attrs[k] === undefined) return;
        if (k === "class") node.className = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  function playIcon(kind) {
    return '<span class="play"><span><svg class="icon"><use href="#i-' + kind + '"/></svg></span></span>';
  }

  /* ---------------------------- theme toggle ---------------------------- */
  (function themeInit() {
    var root = document.documentElement;
    var toggle = document.getElementById("themeToggle");
    var stored = localStorage.getItem("ishmam-theme");
    var prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    var theme = stored || (prefersLight ? "light" : "dark");
    root.setAttribute("data-theme", theme);

    toggle && toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      localStorage.setItem("ishmam-theme", next);
    });
  })();

  /* ------------------------------- year ---------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* --------------------------- nav scroll state --------------------------- */
  var siteNav = document.getElementById("siteNav");
  var scrollProgress = document.getElementById("scrollProgress");

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (siteNav) siteNav.classList.toggle("is-scrolled", y > 12);
    if (scrollProgress) {
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docH > 0 ? (y / docH) * 100 : 0;
      scrollProgress.style.width = pct + "%";
    }
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ------------------------------ mobile menu ------------------------------ */
  var navToggle = document.getElementById("navToggle");
  var mobileMenu = document.getElementById("mobileMenu");

  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  }
  function openMenu() {
    mobileMenu.classList.add("is-open");
    navToggle.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("no-scroll");
  }
  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", function () {
      mobileMenu.classList.contains("is-open") ? closeMenu() : openMenu();
    });
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* --------------------------- active nav section --------------------------- */
  var navLinks = document.querySelectorAll(".nav-links a, .mobile-menu a");
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  if (sections.length && "IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.getAttribute("id");
          navLinks.forEach(function (link) {
            var match = link.getAttribute("href") === "#" + id;
            link.classList.toggle("is-active", match);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* -------------------------------- reveals -------------------------------- */
  function observeReveals(root) {
    var revealEls = (root || document).querySelectorAll("[data-reveal]:not(.is-visible)");
    if (!("IntersectionObserver" in window)) {
      revealEls.forEach(function (el2) { el2.classList.add("is-visible"); });
      return;
    }
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var thisEl = entry.target;
          var delay = thisEl.getAttribute("data-reveal-delay");
          if (delay) thisEl.style.transitionDelay = delay + "ms";
          thisEl.classList.add("is-visible");
          obs.unobserve(thisEl);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (thisEl) { revealObserver.observe(thisEl); });
  }
  observeReveals(document);

  /* ------------------------------ skill bars -------------------------------- */
  var skillItems = document.querySelectorAll(".skill-item");
  if (skillItems.length && "IntersectionObserver" in window) {
    var skillObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var fill = entry.target.querySelector(".skill-fill");
          if (fill) fill.style.width = fill.getAttribute("data-fill") + "%";
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );
    skillItems.forEach(function (thisEl) { skillObserver.observe(thisEl); });
  }

  /* -------------------------------- role cycle ------------------------------- */
  var roleEl = document.getElementById("roleCycle");
  if (roleEl) {
    var roles = ["Law Student", "Writer", "Orator", "Visual Storyteller", "Creative Director", "Filmmaker"];
    if (reduceMotion) {
      roleEl.textContent = roles[0];
    } else {
      var ri = 0, ci = roles[0].length, deleting = false;
      var typeSpeed = 55, deleteSpeed = 30, holdTime = 1500;

      function tick() {
        var word = roles[ri];
        if (!deleting) {
          ci++;
          if (ci > word.length) {
            ci = word.length;
            deleting = true;
            setTimeout(tick, holdTime);
            return;
          }
        } else {
          ci--;
          if (ci < 0) ci = 0;
          if (ci === 0) {
            deleting = false;
            ri = (ri + 1) % roles.length;
          }
        }
        roleEl.textContent = word.slice(0, ci) || roles[ri].slice(0, ci);
        setTimeout(tick, deleting ? deleteSpeed : typeSpeed);
      }
      setTimeout(function () { deleting = true; tick(); }, holdTime);
    }
  }

  /* ------------------------------ magnetic buttons ---------------------------- */
  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".magnetic").forEach(function (btn) {
      var strength = 16;
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform = "translate(" + (x / r.width) * strength + "px," + (y / r.height) * strength + "px)";
      });
      btn.addEventListener("mouseleave", function () {
        btn.style.transform = "translate(0,0)";
      });
    });
  }

  /* ==========================================================================
     WORK SECTION — tabs + collage + reel + frame strips, all rendered from
     PORTFOLIO above.
     ========================================================================== */

  function wkCardMarkup(item, opts) {
    opts = opts || {};
    var isLink = !!item.link && !item.lightbox;
    var tag = isLink ? "a" : "button";
    var attrs = isLink
      ? ' href="' + item.link + '" target="_blank" rel="noopener"'
      : ' type="button"' + (item.lightbox ? ' data-lightbox="' + item.image + '" data-caption="' + (item.caption || item.title) + '"' : "");
    var goTag = isLink ? "a" : "button";
    var goAttrs = isLink
      ? ' href="' + item.link + '" target="_blank" rel="noopener"'
      : ' type="button"' + (item.lightbox ? ' data-lightbox="' + item.image + '" data-caption="' + (item.caption || item.title) + '"' : "");
    var titleClass = item.titleClass ? ' class="' + item.titleClass + '"' : "";
    var mediaIcon = item.category === "Videography" ? playIcon("play") : playIcon("arrow-up-right");

    return (
      '<' + tag + ' class="wk-media"' + attrs + ' aria-label="View ' + item.title.replace(/"/g, "") + '">' +
        '<img src="' + item.image + '" alt="' + (item.caption || item.title).replace(/"/g, "") + '" loading="lazy">' +
        mediaIcon +
      '</' + tag + '>' +
      '<div class="wk-body">' +
        '<div><span class="wk-cat">' + (item.tag || item.category) + '</span><h4' + titleClass + '>' + item.title + '</h4>' +
        (opts.showDesc && item.description ? '<p class="wk-desc">' + item.description + '</p>' : "") +
        (opts.showMeta && item.date ? '<div class="wk-meta"><span>' + item.date + '</span></div>' : "") +
        '</div>' +
        '<' + goTag + ' class="go"' + goAttrs + ' aria-label="Open ' + item.title.replace(/"/g, "") + '"><svg class="icon"><use href="#i-arrow-up-right"/></svg></' + goTag + '>' +
      '</div>'
    );
  }

  /* ---- All Works collage ---- */
  var collageSizes = ["c-big", "", "c-narrow", "c-tall", "", "c-wide", "c-narrow", "", "c-tall", "c-wide", "", "c-narrow"];
  function buildCollage() {
    var host = document.getElementById("workCollage");
    if (!host) return;
    var items = []
      .concat(PORTFOLIO.videography)
      .concat(PORTFOLIO.design)
      .concat(PORTFOLIO.designSeries.filter(function (_, i) { return i % 4 === 0; }))
      .concat(PORTFOLIO.photography);

    items.forEach(function (item, i) {
      var card = el("article", { class: "wk-card " + (collageSizes[i % collageSizes.length]), "data-reveal": "", "data-reveal-delay": String((i % 6) * 60) });
      card.innerHTML = wkCardMarkup(item, {});
      host.appendChild(card);
    });
  }

  /* ---- Videography reel ---- */
  function buildReel() {
    var track = document.getElementById("videoReelTrack");
    var reel = document.getElementById("videoReel");
    if (!track || !reel) return;
    var items = PORTFOLIO.videography;
    if (!items.length) {
      track.innerHTML = '<p class="strip-note">New films land here soon.</p>';
      return;
    }
    items.forEach(function (item) {
      var card = el("article", { class: "wk-card reel-card" });
      card.innerHTML = wkCardMarkup(item, { showDesc: true, showMeta: true });
      track.appendChild(card);
    });

    // focus the centred card visually
    var cards = Array.prototype.slice.call(track.children);
    function updateFocus() {
      var center = reel.scrollLeft + reel.clientWidth / 2;
      var closest = null, closestDist = Infinity;
      cards.forEach(function (c) {
        var mid = c.offsetLeft + c.offsetWidth / 2;
        var dist = Math.abs(mid - center);
        if (dist < closestDist) { closestDist = dist; closest = c; }
      });
      cards.forEach(function (c) { c.classList.toggle("is-focused", c === closest); });
    }
    reel.addEventListener("scroll", function () {
      window.requestAnimationFrame(updateFocus);
    }, { passive: true });
    updateFocus();

    // arrow controls
    var arrows = document.querySelectorAll('.reel-arrow[data-reel-dir]');
    arrows.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var dir = parseInt(btn.getAttribute("data-reel-dir"), 10);
        var cardWidth = cards[0] ? cards[0].getBoundingClientRect().width + 32 : 400;
        reel.scrollBy({ left: dir * cardWidth, behavior: reduceMotion ? "auto" : "smooth" });
      });
    });

    enableDragScroll(reel);
    enableKeyboardScroll(reel);
  }

  /* ---- Photography / Design frame strips ---- */
  function buildStrip(hostId, items, emptyMessage) {
    var track = document.getElementById(hostId);
    if (!track) return;
    if (!items.length) {
      var empty = el("figure", { class: "strip-empty" });
      empty.innerHTML =
        '<svg class="icon" viewBox="0 0 24 24"><path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linejoin="round"/><circle cx="12" cy="13.5" r="3.4" stroke="currentColor" stroke-width="1.4" fill="none"/></svg>' +
        '<span>' + (emptyMessage || "New work coming soon.") + '</span>' +
        '<a href="https://www.instagram.com/byishmam/" target="_blank" rel="noopener" class="link-arrow">Follow along on Instagram<svg><use href="#i-arrow-right"/></svg></a>';
      track.appendChild(empty);
      return;
    }
    items.forEach(function (item) {
      var figure = el("figure", {});
      var caption = item.caption || item.title;
      figure.innerHTML =
        '<img src="' + item.image + '" alt="' + caption.replace(/"/g, "") + '" loading="lazy">' +
        '<figcaption>' + caption + '</figcaption>';
      if (item.lightbox) {
        figure.style.cursor = "pointer";
        figure.setAttribute("data-lightbox", item.image);
        figure.setAttribute("data-caption", caption);
        figure.setAttribute("tabindex", "0");
        figure.setAttribute("role", "button");
        figure.setAttribute("aria-label", "View " + caption);
      }
      track.appendChild(figure);
    });
    var strip = track.closest(".frame-strip");
    if (strip) { enableDragScroll(strip); enableKeyboardScroll(strip); }
  }

  /* ---- shared: drag-to-scroll for horizontal tracks ---- */
  function enableDragScroll(container) {
    var isDown = false, startX = 0, startScroll = 0, moved = false;
    container.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      isDown = true; moved = false;
      startX = e.clientX;
      startScroll = container.scrollLeft;
      container.classList.add("is-dragging");
      container.setPointerCapture(e.pointerId);
    });
    container.addEventListener("pointermove", function (e) {
      if (!isDown) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      container.scrollLeft = startScroll - dx;
    });
    function endDrag(e) {
      if (!isDown) return;
      isDown = false;
      container.classList.remove("is-dragging");
      if (moved) {
        // prevent the click that follows a drag from firing card links
        var suppress = function (ev) { ev.preventDefault(); ev.stopPropagation(); container.removeEventListener("click", suppress, true); };
        container.addEventListener("click", suppress, true);
      }
    }
    container.addEventListener("pointerup", endDrag);
    container.addEventListener("pointerleave", endDrag);
    container.addEventListener("pointercancel", endDrag);
  }

  function enableKeyboardScroll(container) {
    container.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      var amount = container.clientWidth * 0.6 * (e.key === "ArrowRight" ? 1 : -1);
      container.scrollBy({ left: amount, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---- tabs ---- */
  function initWorkTabs() {
    var tabRow = document.querySelector(".work-tabs");
    if (!tabRow) return;
    var buttons = tabRow.querySelectorAll("button[data-tab]");
    var panels = document.querySelectorAll(".work-panel");
    var countEl = document.getElementById("workTabsCount");

    var counts = {
      all: PORTFOLIO.videography.length + PORTFOLIO.design.length + PORTFOLIO.designSeries.filter(function (_, i) { return i % 4 === 0; }).length + PORTFOLIO.photography.length,
      videography: PORTFOLIO.videography.length,
      photography: PORTFOLIO.photography.length,
      design: PORTFOLIO.design.length + PORTFOLIO.designSeries.length
    };
    function setCount(tab) {
      if (!countEl) return;
      var n = counts[tab] || 0;
      countEl.textContent = n + (n === 1 ? " piece" : " pieces");
    }
    setCount("all");

    tabRow.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-tab]");
      if (!btn) return;
      var tab = btn.getAttribute("data-tab");
      buttons.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", active ? "true" : "false");
      });
      panels.forEach(function (p) {
        var active = p.id === "panel-" + tab;
        p.classList.toggle("is-active", active);
        if (active) { p.removeAttribute("hidden"); observeReveals(p); }
        else p.setAttribute("hidden", "");
      });
      setCount(tab);
    });
  }

  buildCollage();
  buildReel();
  buildStrip("photoStripTrack", PORTFOLIO.photography, "A dedicated photography set is coming — check back soon.");
  buildStrip("designStripTrack", PORTFOLIO.design.concat(PORTFOLIO.designSeries));
  initWorkTabs();
  observeReveals(document);

  /* ==========================================================================
     ABOUT — image carousel
     ========================================================================== */
  (function aboutCarousel() {
    var root = document.getElementById("aboutCarousel");
    if (!root) return;
    var slides = Array.prototype.slice.call(root.querySelectorAll(".about-slide"));
    if (!slides.length) return;
    var dotsHost = document.getElementById("aboutCarouselDots");
    var index = 0;
    var timer = null;
    var AUTOPLAY_MS = 4200;

    slides.forEach(function (s, i) {
      var dot = el("button", { type: "button", "aria-label": "Go to photo " + (i + 1), role: "tab", "aria-selected": i === 0 ? "true" : "false" });
      dot.addEventListener("click", function () { goTo(i); restart(); });
      dotsHost.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsHost.children);

    function render() {
      slides.forEach(function (s, i) { s.classList.toggle("is-active", i === index); });
      dots.forEach(function (d, i) {
        d.classList.toggle("is-active", i === index);
        d.setAttribute("aria-selected", i === index ? "true" : "false");
      });
    }
    function goTo(i) { index = (i + slides.length) % slides.length; render(); }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }
    function restart() {
      if (timer) clearInterval(timer);
      if (reduceMotion) return;
      timer = setInterval(next, AUTOPLAY_MS);
    }

    root.querySelectorAll(".carousel-arrow").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var dir = parseInt(btn.getAttribute("data-dir") || (btn.classList.contains("next") ? "1" : "-1"), 10);
        dir === 1 ? next() : prev();
        restart();
      });
    });

    root.addEventListener("mouseenter", function () { if (timer) clearInterval(timer); });
    root.addEventListener("mouseleave", restart);
    root.addEventListener("focusin", function () { if (timer) clearInterval(timer); });
    root.addEventListener("focusout", restart);

    // swipe support
    var startX = null;
    root.addEventListener("pointerdown", function (e) { startX = e.clientX; });
    root.addEventListener("pointerup", function (e) {
      if (startX === null) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); restart(); }
      startX = null;
    });

    // keyboard
    root.setAttribute("tabindex", "0");
    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { next(); restart(); }
      if (e.key === "ArrowLeft") { prev(); restart(); }
    });

    render();
    restart();
  })();

  /* --------------------------------- lightbox (delegated) ------------------------------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxCaption = document.getElementById("lightboxCaption");
  var lightboxClose = document.getElementById("lightboxClose");
  var lastFocused = null;

  function openLightbox(src, caption) {
    if (!lightbox) return;
    lastFocused = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = caption || "";
    lightboxCaption.textContent = caption || "";
    lightbox.classList.add("is-open");
    document.body.classList.add("no-scroll");
    lightboxClose.focus();
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    lightboxImg.src = "";
    if (lastFocused) lastFocused.focus();
  }
  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-lightbox]");
    if (!trigger) return;
    e.preventDefault();
    openLightbox(trigger.getAttribute("data-lightbox"), trigger.getAttribute("data-caption"));
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    var trigger = document.activeElement && document.activeElement.closest && document.activeElement.closest("[data-lightbox]");
    if (!trigger || trigger.tagName === "BUTTON" || trigger.tagName === "A") return; // native elements already handle this
    e.preventDefault();
    openLightbox(trigger.getAttribute("data-lightbox"), trigger.getAttribute("data-caption"));
  });
  lightboxClose && lightboxClose.addEventListener("click", closeLightbox);
  lightbox && lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightbox && lightbox.classList.contains("is-open")) closeLightbox();
  });

  /* ------------------------------- floating labels -------------------------------- */
  document.querySelectorAll(".field input, .field textarea, .field select").forEach(function (input) {
    var field = input.closest(".field");
    function sync() { field.classList.toggle("has-value", (input.value || "").trim().length > 0); }
    input.addEventListener("input", sync);
    input.addEventListener("change", sync);
    input.addEventListener("blur", sync);
    sync();
  });

  /* -------------------------------- radio pills ------------------------------------ */
  document.querySelectorAll(".radio-pill input[type=radio]").forEach(function (radio) {
    radio.addEventListener("change", function () {
      var name = radio.name;
      document.querySelectorAll('.radio-pill input[name="' + name + '"]').forEach(function (r) {
        r.closest(".radio-pill").classList.toggle("is-checked", r.checked);
      });
    });
    if (radio.checked) radio.closest(".radio-pill").classList.add("is-checked");
  });

  /* -------------------------------- contact form ----------------------------------- */
  var form = document.getElementById("contactForm");
  if (form) {
    var statusBox = document.getElementById("formStatus");
    var statusText = statusBox ? statusBox.querySelector(".form-status-text") : null;
    var submitBtn = document.getElementById("submitBtn");
    var honeypot = document.getElementById("cf-company");

    function setStatus(state, message) {
      if (!statusBox) return;
      statusBox.classList.remove("is-loading", "is-success", "is-error");
      if (state) statusBox.classList.add("is-" + state);
      if (statusText) statusText.textContent = message || "";
    }

    function validateField(field) {
      var input = field.querySelector("input, textarea");
      if (!input) return true;
      var valid = input.checkValidity();
      field.classList.toggle("has-error", !valid);
      return valid;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // silently drop likely-bot submissions (honeypot filled)
      if (honeypot && honeypot.value.trim() !== "") {
        setStatus("success", "Message sent — thank you. I'll reply soon.");
        form.reset();
        return;
      }

      var isPlaceholderEndpoint = /YOUR_FORM_ID/.test(form.action);
      if (isPlaceholderEndpoint) {
        setStatus("error", "Contact form isn't configured yet — see README.md to connect Formspree.");
        return;
      }

      var fields = form.querySelectorAll(".field:not(.field-hp)");
      var allValid = true;
      fields.forEach(function (field) {
        if (!validateField(field)) allValid = false;
      });
      if (!allValid) {
        setStatus("error", "Please fix the highlighted fields.");
        return;
      }

      submitBtn.disabled = true;
      setStatus("loading", "Sending your message…");

      var data = new FormData(form);
      fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      })
        .then(function (response) {
          if (response.ok) {
            setStatus("success", "Message sent — thank you. I'll reply soon.");
            form.reset();
            form.querySelectorAll(".field").forEach(function (f) { f.classList.remove("has-value", "has-error"); });
            document.querySelectorAll(".radio-pill").forEach(function (p, i) { p.classList.toggle("is-checked", i === 0); });
          } else {
            response
              .json()
              .then(function (payload) {
                var msg =
                  payload && payload.errors
                    ? payload.errors.map(function (er) { return er.message; }).join(", ")
                    : "Something went wrong. Please try again.";
                setStatus("error", msg);
              })
              .catch(function () {
                setStatus("error", "Something went wrong. Please try again.");
              });
          }
        })
        .catch(function () {
          setStatus("error", "Network error — please check your connection and try again.");
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });

    form.querySelectorAll("input, textarea").forEach(function (input) {
      input.addEventListener("blur", function () {
        var field = input.closest(".field");
        if (field && !field.classList.contains("field-hp")) validateField(field);
      });
    });
  }

  /* ------------------------------- hero letter reveal --------------------------------- */
  if (hasGSAP && !reduceMotion) {
    gsap.set(".hero-name .word span", { yPercent: 110 });
    gsap.timeline({ delay: 0.15 })
      .to(".hero-name .word span", { yPercent: 0, duration: 1, ease: "power4.out", stagger: 0.08 })
      .from(".scroll-cue", { opacity: 0, duration: 0.6 }, "-=0.4");

    if (window.ScrollTrigger) {
      gsap.utils.toArray(".statement blockquote").forEach(function (thisEl) {
        gsap.fromTo(
          thisEl,
          { opacity: 0.35 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: thisEl, start: "top 85%", end: "top 40%", scrub: true }
          }
        );
      });

      gsap.to(".hero-portrait img", {
        yPercent: 6,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
      });
    }
  } else {
    document.querySelectorAll(".hero-name .word span").forEach(function (s) {
      s.style.transform = "none";
    });
  }
})();
