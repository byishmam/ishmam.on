/**
 * Apple-style theme (light / dark / system) + motion layer.
 * Works alongside main.js without modifying it.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "ishmam-theme"; // 'light' | 'dark' | 'system'
  var root = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------
   * 1) Theme: resolve + apply
   * ------------------------------------------------------------- */
  function getStoredPref() {
    try {
      return localStorage.getItem(STORAGE_KEY) || "system";
    } catch (e) {
      return "system";
    }
  }

  function setStoredPref(pref) {
    try {
      localStorage.setItem(STORAGE_KEY, pref);
    } catch (e) {}
  }

  function systemPrefersLight() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  }

  function resolveEffectiveTheme(pref) {
    if (pref === "light" || pref === "dark") return pref;
    // system: this template's original design is the dark palette,
    // so system-light maps to the new light palette and everything
    // else (no-preference / dark) keeps the original dark palette.
    return systemPrefersLight() ? "light" : "dark";
  }

  function applyTheme(pref) {
    var effective = resolveEffectiveTheme(pref);
    root.setAttribute("data-theme", effective);
    root.setAttribute("data-theme-pref", pref);
    updateSwitcherUI(pref);
  }

  function updateSwitcherUI(pref) {
    document.querySelectorAll(".theme-switcher button").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-theme-choice") === pref);
    });
  }

  // Apply immediately (head-level inline script already avoided a flash;
  // this keeps things in sync if this file ever runs standalone).
  applyTheme(getStoredPref());

  if (window.matchMedia) {
    var mql = window.matchMedia("(prefers-color-scheme: light)");
    var onSystemChange = function () {
      if (getStoredPref() === "system") applyTheme("system");
    };
    if (mql.addEventListener) mql.addEventListener("change", onSystemChange);
    else if (mql.addListener) mql.addListener(onSystemChange);
  }

  /* ---------------------------------------------------------------
   * 2) Theme switcher UI — injected into the header so every page
   *    gets it without hand-editing each file's markup.
   * ------------------------------------------------------------- */
  function buildSwitcher() {
    var container = document.querySelector(".header .header-container");
    if (!container || container.querySelector(".theme-switcher")) return;

    var wrap = document.createElement("div");
    wrap.className = "theme-switcher";
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", "Theme");

    var options = [
      { key: "light", icon: "bi-sun-fill", label: "Light" },
      { key: "dark", icon: "bi-moon-stars-fill", label: "Dark" },
      { key: "system", icon: "bi-circle-half", label: "System" }
    ];

    options.forEach(function (opt) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("data-theme-choice", opt.key);
      btn.setAttribute("aria-label", opt.label);
      btn.title = opt.label;
      btn.innerHTML = '<i class="bi ' + opt.icon + '"></i>';
      btn.addEventListener("click", function () {
        setStoredPref(opt.key);
        applyTheme(opt.key);
      });
      wrap.appendChild(btn);
    });

    var nav = container.querySelector("#navmenu");
    if (nav) {
      container.insertBefore(wrap, nav);
    } else {
      container.appendChild(wrap);
    }
    updateSwitcherUI(getStoredPref());
  }

  /* ---------------------------------------------------------------
   * 3) Scroll reveal for elements without AOS (IntersectionObserver)
   * ------------------------------------------------------------- */
  function initRevealObserver() {
    var targets = document.querySelectorAll(
      ".service-item, .pricing-item, .member, .campaign-item, .testimonial-item, .stats-item, .skills-category"
    );
    if (!targets.length) return;

    targets.forEach(function (el) {
      if (!el.hasAttribute("data-aos")) el.classList.add("reveal-el");
    });

    if (!("IntersectionObserver" in window) || reduceMotion) {
      document.querySelectorAll(".reveal-el").forEach(function (el) {
        el.classList.add("reveal-in");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            var el = entry.target;
            setTimeout(function () {
              el.classList.add("reveal-in");
            }, (i % 6) * 60);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    document.querySelectorAll(".reveal-el").forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------------------------------------------------------------
   * 4) Magnetic buttons + ripple (desktop only, Apple/Awwwards feel)
   * ------------------------------------------------------------- */
  function initMagneticButtons() {
    if (reduceMotion) return;
    var isFinePointer = window.matchMedia && window.matchMedia("(pointer: fine)").matches;

    document.querySelectorAll(".btn").forEach(function (btn) {
      if (isFinePointer) {
        btn.addEventListener("mousemove", function (e) {
          var rect = btn.getBoundingClientRect();
          var x = e.clientX - rect.left - rect.width / 2;
          var y = e.clientY - rect.top - rect.height / 2;
          btn.style.transform = "translate(" + x * 0.12 + "px, " + y * 0.28 + "px)";
        });
        btn.addEventListener("mouseleave", function () {
          btn.style.transform = "";
        });
      }

      btn.addEventListener("click", function (e) {
        var rect = btn.getBoundingClientRect();
        var ripple = document.createElement("span");
        var size = Math.max(rect.width, rect.height);
        ripple.className = "ripple";
        ripple.style.width = ripple.style.height = size + "px";
        ripple.style.left = e.clientX - rect.left - size / 2 + "px";
        ripple.style.top = e.clientY - rect.top - size / 2 + "px";
        btn.appendChild(ripple);
        setTimeout(function () {
          ripple.remove();
        }, 650);
      });
    });
  }

  /* ---------------------------------------------------------------
   * 5) Ambient cursor glow (fine-pointer desktops only)
   * ------------------------------------------------------------- */
  function initCursorGlow() {
    if (reduceMotion) return;
    if (!window.matchMedia || !window.matchMedia("(pointer: fine)").matches) return;

    var glow = document.createElement("div");
    glow.className = "apple-cursor-glow";
    document.body.appendChild(glow);

    var raf = null;
    window.addEventListener("mousemove", function (e) {
      glow.classList.add("is-active");
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        glow.style.transform = "translate(" + e.clientX + "px, " + e.clientY + "px) translate(-50%, -50%)";
      });
    });

    window.addEventListener("mouseleave", function () {
      glow.classList.remove("is-active");
    });
  }

  /* ---------------------------------------------------------------
   * 6) Sliding nav indicator — glides behind the hovered/active link
   * ------------------------------------------------------------- */
  function initNavIndicator() {
    var nav = document.querySelector("#navmenu");
    if (!nav) return;
    var list = nav.querySelector("ul");
    if (!list) return;

    var indicator = document.createElement("div");
    indicator.className = "nav-indicator";
    list.style.position = "relative";
    list.appendChild(indicator);

    function moveTo(link) {
      if (!link) {
        indicator.classList.remove("is-visible");
        return;
      }
      var listRect = list.getBoundingClientRect();
      var linkRect = link.getBoundingClientRect();
      indicator.style.width = linkRect.width + "px";
      indicator.style.height = linkRect.height + "px";
      indicator.style.transform =
        "translate(" + (linkRect.left - listRect.left) + "px, " + (linkRect.top - listRect.top) + "px)";
      indicator.classList.add("is-visible");
    }

    var links = nav.querySelectorAll("ul > li > a");
    links.forEach(function (a) {
      a.addEventListener("mouseenter", function () {
        moveTo(a);
      });
    });

    nav.addEventListener("mouseleave", function () {
      var active = nav.querySelector("ul > li > a.active");
      moveTo(active);
    });

    window.addEventListener("resize", function () {
      var active = nav.querySelector("ul > li > a.active");
      moveTo(active);
    });

    var initialActive = nav.querySelector("ul > li > a.active");
    if (initialActive) {
      // Wait a tick so layout (fonts/icons) has settled before measuring.
      setTimeout(function () {
        moveTo(initialActive);
      }, 60);
    }
  }

  /* ---------------------------------------------------------------
   * 7) Page-transition fallback — for browsers without native
   *    cross-document View Transitions, fade+blur out before
   *    navigating to same-origin pages so it never feels like a
   *    hard reload. No-op for hash links, new tabs, or downloads.
   * ------------------------------------------------------------- */
  function supportsNativeViewTransitions() {
    return "startViewTransition" in document || CSS.supports("navigation", "auto");
  }

  function initPageTransitions() {
    if (reduceMotion) return;
    if (supportsNativeViewTransitions()) return; // let the browser handle it natively

    document.addEventListener("click", function (e) {
      var link = e.target.closest && e.target.closest("a[href]");
      if (!link) return;
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (link.target && link.target !== "_self") return;
      if (link.hasAttribute("download")) return;

      var href = link.getAttribute("href") || "";
      if (!href || href.charAt(0) === "#" || href.indexOf("mailto:") === 0 || href.indexOf("tel:") === 0) return;

      var url;
      try {
        url = new URL(href, window.location.href);
      } catch (err) {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.hash) return;

      e.preventDefault();
      root.classList.add("apple-leaving");
      setTimeout(function () {
        window.location.href = url.href;
      }, 260);
    });
  }

  /* ---------------------------------------------------------------
   * Init
   * ------------------------------------------------------------- */
  function init() {
    buildSwitcher();
    initRevealObserver();
    initMagneticButtons();
    initCursorGlow();
    initNavIndicator();
    initPageTransitions();
    root.classList.add("theme-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
