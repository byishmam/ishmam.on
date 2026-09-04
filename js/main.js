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
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var delay = el.getAttribute("data-reveal-delay");
          if (delay) el.style.transitionDelay = delay + "ms";
          el.classList.add("is-visible");
          obs.unobserve(el);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

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
    skillItems.forEach(function (el) { skillObserver.observe(el); });
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
      // start after initial hold on first word
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

  /* -------------------------------- work filter -------------------------------- */
  var filterRow = document.querySelector(".filter-row");
  var workCards = document.querySelectorAll(".work-card");
  if (filterRow && workCards.length) {
    filterRow.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-filter]");
      if (!btn) return;
      filterRow.querySelectorAll("button").forEach(function (b) {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");
      var filter = btn.getAttribute("data-filter");
      workCards.forEach(function (card) {
        var cats = (card.getAttribute("data-cat") || "").split(" ");
        var show = filter === "all" || cats.indexOf(filter) !== -1;
        card.classList.toggle("is-hidden", !show);
      });
    });
  }

  /* --------------------------------- lightbox ----------------------------------- */
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
  document.querySelectorAll("[data-lightbox]").forEach(function (trigger) {
    trigger.addEventListener("click", function (e) {
      e.preventDefault();
      openLightbox(trigger.getAttribute("data-lightbox"), trigger.getAttribute("data-caption"));
    });
  });
  lightboxClose && lightboxClose.addEventListener("click", closeLightbox);
  lightbox && lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightbox && lightbox.classList.contains("is-open")) closeLightbox();
  });

  /* ------------------------------- floating labels -------------------------------- */
  document.querySelectorAll(".field input, .field textarea").forEach(function (input) {
    var field = input.closest(".field");
    function sync() { field.classList.toggle("has-value", input.value.trim().length > 0); }
    input.addEventListener("input", sync);
    input.addEventListener("blur", sync);
    sync();
  });

  /* -------------------------------- contact form ----------------------------------- */
  var form = document.getElementById("contactForm");
  if (form) {
    var statusBox = document.getElementById("formStatus");
    var statusText = statusBox ? statusBox.querySelector(".form-status-text") : null;
    var submitBtn = document.getElementById("submitBtn");

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
      var fields = form.querySelectorAll(".field");
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
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
          if (response.ok) {
            setStatus("success", "Message sent — thank you. I'll reply soon.");
            form.reset();
            form.querySelectorAll(".field").forEach(function (f) { f.classList.remove("has-value", "has-error"); });
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
        validateField(input.closest(".field"));
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
      gsap.utils.toArray(".statement blockquote").forEach(function (el) {
        gsap.fromTo(
          el,
          { opacity: 0.35 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 85%", end: "top 40%", scrub: true },
          }
        );
      });

      gsap.to(".hero-portrait img", {
        yPercent: 6,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });
    }
  } else {
    document.querySelectorAll(".hero-name .word span").forEach(function (s) {
      s.style.transform = "none";
    });
  }
})();
