/* =========================================================
   ISHMAM — Personal Portfolio — main.js
   Vanilla JS. No build step. Respects prefers-reduced-motion.
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var html = document.documentElement;

  /* ---------------- Preloader ---------------- */
  window.addEventListener("load", function () {
    var pre = document.getElementById("preloader");
    if (pre) {
      setTimeout(function () { pre.classList.add("is-done"); }, 250);
    }
  });

  /* ---------------- Theme ---------------- */
  (function themeInit() {
    var stored = null;
    try { stored = localStorage.getItem("ishmam-theme"); } catch (e) {}
    var prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    var theme = stored || (prefersLight ? "light" : "dark");
    html.setAttribute("data-theme", theme);

    document.addEventListener("DOMContentLoaded", function () {
      var toggles = document.querySelectorAll(".theme-toggle");
      toggles.forEach(function (btn) {
        btn.addEventListener("click", function () {
          var current = html.getAttribute("data-theme");
          var next = current === "dark" ? "light" : "dark";
          html.setAttribute("data-theme", next);
          try { localStorage.setItem("ishmam-theme", next); } catch (e) {}
        });
      });
    });
  })();

  /* ---------------- Smooth scroll (Lenis if available) ---------------- */
  var lenis = null;
  document.addEventListener("DOMContentLoaded", function () {
    if (!reduceMotion && window.Lenis) {
      lenis = new window.Lenis({ duration: 1.05, smoothWheel: true, touchMultiplier: 1.1 });
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
      if (window.gsap && window.gsap.ticker) {
        window.gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      }
      window.__lenis = lenis;
    }
  });

  /* ---------------- Header scroll state + active link ---------------- */
  document.addEventListener("DOMContentLoaded", function () {
    var header = document.getElementById("site-header");
    var onScroll = function () {
      if (!header) return;
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // scroll progress rail
    var fill = document.querySelector(".scroll-rail-fill");
    if (fill) {
      var updateRail = function () {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        var pct = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0;
        fill.style.height = pct + "%";
      };
      window.addEventListener("scroll", updateRail, { passive: true });
      updateRail();
    }
  });

  /* ---------------- Mobile / overlay nav ---------------- */
  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector(".menu-toggle");
    var overlay = document.querySelector(".nav-overlay");
    if (!toggle || !overlay) return;

    function closeMenu() {
      overlay.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
    function openMenu() {
      overlay.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }
    toggle.addEventListener("click", function () {
      var isOpen = overlay.classList.contains("is-open");
      isOpen ? closeMenu() : openMenu();
    });
    overlay.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  });

  /* ---------------- Active nav link by current page ---------------- */
  document.addEventListener("DOMContentLoaded", function () {
    var path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a[data-page]").forEach(function (a) {
      if (a.getAttribute("data-page") === path) a.classList.add("active");
    });
  });

  /* ---------------- Scroll reveal (IntersectionObserver) ---------------- */
  document.addEventListener("DOMContentLoaded", function () {
    var targets = document.querySelectorAll(".reveal, .reveal-fade");
    if (!("IntersectionObserver" in window) || reduceMotion) {
      targets.forEach(function (t) { t.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var delay = entry.target.getAttribute("data-delay");
            if (delay) entry.target.style.transitionDelay = delay + "ms";
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    targets.forEach(function (t) { io.observe(t); });
  });

  /* ---------------- Animated progress bars (skills) ---------------- */
  document.addEventListener("DOMContentLoaded", function () {
    var bars = document.querySelectorAll(".bar-fill[data-pct]");
    if (!bars.length) return;
    if (!("IntersectionObserver" in window)) {
      bars.forEach(function (b) { b.style.width = b.getAttribute("data-pct") + "%"; });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.getAttribute("data-pct") + "%";
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    bars.forEach(function (b) { io.observe(b); });
  });

  /* ---------------- Hero text reveal + stagger (GSAP if present) ---------------- */
  document.addEventListener("DOMContentLoaded", function () {
    var lines = document.querySelectorAll(".hero h1 .line span");
    if (!lines.length) return;
    if (reduceMotion) {
      lines.forEach(function (l) { l.style.transform = "none"; l.style.opacity = 1; });
      return;
    }
    if (window.gsap) {
      window.gsap.set(lines, { yPercent: 110 });
      window.gsap.to(lines, {
        yPercent: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.09,
        delay: 0.35
      });
      window.gsap.from(".hero-kicker, .hero-role, .hero-desc, .hero-actions, .hero .social-row", {
        opacity: 0, y: 16, duration: 0.9, ease: "power3.out", stagger: 0.08, delay: 0.55
      });
      window.gsap.from(".hero-visual", { opacity: 0, y: 24, duration: 1, ease: "power3.out", delay: 0.4 });
    } else {
      lines.forEach(function (l, i) {
        l.style.transition = "transform 0.9s cubic-bezier(.16,1,.3,1) " + (i * 90) + "ms, opacity 0.9s ease " + (i * 90) + "ms";
        requestAnimationFrame(function () {
          l.style.transform = "none";
          l.style.opacity = 1;
        });
      });
    }
  });

  /* ---------------- ScrollTrigger parallax + section pinning cues ---------------- */
  document.addEventListener("DOMContentLoaded", function () {
    if (reduceMotion || !window.gsap || !window.ScrollTrigger) return;
    window.gsap.registerPlugin(window.ScrollTrigger);

    // subtle parallax on hero visual
    var visual = document.querySelector(".hero-frame");
    if (visual) {
      window.gsap.to(visual, {
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
      });
    }

    // orbit rotation
    document.querySelectorAll(".hero-orbit").forEach(function (o, i) {
      window.gsap.to(o, {
        rotate: 360,
        duration: 40 + i * 15,
        repeat: -1,
        ease: "none"
      });
    });

    if (window.ScrollTrigger.refresh) {
      window.addEventListener("load", function () { window.ScrollTrigger.refresh(); });
    }
  });

  /* ---------------- Typed role text (lightweight, dependency-free) ---------------- */
  document.addEventListener("DOMContentLoaded", function () {
    var el = document.querySelector("[data-typed]");
    if (!el) return;
    var items = (el.getAttribute("data-typed") || "").split("|").map(function (s) { return s.trim(); }).filter(Boolean);
    if (!items.length) return;

    if (reduceMotion) {
      el.textContent = items[0];
      return;
    }

    var textSpan = document.createElement("span");
    var cursor = document.createElement("span");
    cursor.className = "cursor-bar";
    cursor.setAttribute("aria-hidden", "true");
    el.textContent = "";
    el.appendChild(textSpan);
    el.appendChild(cursor);

    var wordIndex = 0, charIndex = 0, deleting = false;
    function tick() {
      var word = items[wordIndex];
      if (!deleting) {
        charIndex++;
        textSpan.textContent = word.slice(0, charIndex);
        if (charIndex === word.length) {
          deleting = true;
          setTimeout(tick, 1400);
          return;
        }
        setTimeout(tick, 55 + Math.random() * 40);
      } else {
        charIndex--;
        textSpan.textContent = word.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % items.length;
          setTimeout(tick, 350);
          return;
        }
        setTimeout(tick, 28);
      }
    }
    tick();
  });

  /* ---------------- Magnetic buttons ---------------- */
  document.addEventListener("DOMContentLoaded", function () {
    if (reduceMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    document.querySelectorAll(".magnetic").forEach(function (el) {
      var strength = 18;
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        el.style.transform = "translate(" + (x / r.width) * strength + "px," + (y / r.height) * strength + "px)";
      });
      el.addEventListener("mouseleave", function () {
        el.style.transform = "translate(0,0)";
      });
    });
  });

  /* ---------------- Custom cursor dot ---------------- */
  document.addEventListener("DOMContentLoaded", function () {
    if (reduceMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    var dot = document.createElement("div");
    dot.className = "cursor-dot";
    document.body.appendChild(dot);
    window.addEventListener("mousemove", function (e) {
      dot.style.left = e.clientX + "px";
      dot.style.top = e.clientY + "px";
    });
    document.querySelectorAll("a, button, .work-card").forEach(function (el) {
      el.addEventListener("mouseenter", function () { dot.classList.add("is-active"); });
      el.addEventListener("mouseleave", function () { dot.classList.remove("is-active"); });
    });
  });

  /* ---------------- Scroll top button ---------------- */
  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.querySelector(".scroll-top");
    if (!btn) return;
    var toggle = function () { btn.classList.toggle("is-visible", window.scrollY > 500); };
    window.addEventListener("scroll", toggle, { passive: true });
    toggle();
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      if (lenis) lenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  });

  /* ---------------- Portfolio filters ---------------- */
  document.addEventListener("DOMContentLoaded", function () {
    var chips = document.querySelectorAll(".filter-chip");
    var cards = document.querySelectorAll(".work-card");
    if (!chips.length) return;
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("is-active"); });
        chip.classList.add("is-active");
        var filter = chip.getAttribute("data-filter");
        cards.forEach(function (card) {
          var show = filter === "*" || card.getAttribute("data-category") === filter;
          card.classList.toggle("is-hidden", !show);
        });
      });
    });
  });

  /* ---------------- Lightweight lightbox ---------------- */
  document.addEventListener("DOMContentLoaded", function () {
    var triggers = document.querySelectorAll("[data-lightbox]");
    if (!triggers.length) return;

    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.innerHTML =
      '<button class="lightbox-close" aria-label="Close image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '<figure class="lightbox-fig"><img alt=""><figcaption></figcaption></figure>';
    document.body.appendChild(lb);
    var img = lb.querySelector("img");
    var cap = lb.querySelector("figcaption");

    function open(src, caption) {
      img.src = src;
      img.alt = caption || "";
      cap.textContent = caption || "";
      lb.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }
    function close() {
      lb.classList.remove("is-open");
      document.body.style.overflow = "";
    }
    triggers.forEach(function (t) {
      t.addEventListener("click", function (e) {
        e.preventDefault();
        open(t.getAttribute("data-lightbox"), t.getAttribute("data-caption"));
      });
    });
    lb.querySelector(".lightbox-close").addEventListener("click", close);
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  });

  /* ---------------- Services accordion (mobile-friendly expand) ---------------- */
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".service-row").forEach(function (row) {
      row.addEventListener("click", function () {
        var wasOpen = row.classList.contains("is-open");
        document.querySelectorAll(".service-row").forEach(function (r) { r.classList.remove("is-open"); });
        if (!wasOpen) row.classList.add("is-open");
      });
    });
  });

  /* ---------------- Contact form (Formspree, progressively enhanced) ---------------- */
  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("contact-form");
    if (!form) return;
    var status = document.getElementById("form-status");
    var submitBtn = form.querySelector("[type=submit]");

    function setStatus(state, message) {
      status.className = "form-status" + (state ? " is-" + state : "");
      status.innerHTML = (state === "loading" ? '<span class="spinner"></span>' : "") + message;
    }
    function fieldError(name, message) {
      var field = form.querySelector('[name="' + name + '"]');
      if (!field) return;
      var wrap = field.closest(".field");
      var err = wrap.querySelector(".field-error");
      wrap.classList.toggle("has-error", !!message);
      if (err) err.textContent = message || "";
    }
    function validate() {
      var ok = true;
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var subject = form.subject.value.trim();
      var msg = form.message.value.trim();
      fieldError("name", name ? "" : "Please enter your name.");
      if (!name) ok = false;
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      fieldError("email", emailOk ? "" : "Enter a valid email address.");
      if (!emailOk) ok = false;
      fieldError("subject", subject ? "" : "A short subject helps me reply faster.");
      if (!subject) ok = false;
      fieldError("message", msg.length >= 10 ? "" : "Message should be at least 10 characters.");
      if (msg.length < 10) ok = false;
      return ok;
    }
    ["name", "email", "subject", "message"].forEach(function (name) {
      var field = form.querySelector('[name="' + name + '"]');
      if (field) field.addEventListener("input", function () { fieldError(name, ""); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) {
        setStatus("error", "Please fix the highlighted fields.");
        return;
      }
      setStatus("loading", "Sending…");
      submitBtn.disabled = true;

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (response) {
          if (response.ok) {
            setStatus("success", "Message sent — thank you. I'll reply soon.");
            form.reset();
          } else {
            return response.json().then(function (data) {
              var msg = data && data.errors
                ? data.errors.map(function (e) { return e.message; }).join(", ")
                : "Something went wrong. Please try again.";
              setStatus("error", msg);
            });
          }
        })
        .catch(function () {
          setStatus("error", "Network error — please try again, or email me directly.");
        })
        .finally(function () { submitBtn.disabled = false; });
    });
  });
})();
