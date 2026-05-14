(function () {
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  var menuToggle = document.getElementById("menu-toggle");
  var menuRoot = document.getElementById("projects-menu");
  if (menuToggle && menuRoot) {
    var openLabel = "Apri menu progetti";
    var closeLabel = "Chiudi menu progetti";
    var firstLink = menuRoot.querySelector(".menu-drawer__link");
    var menuLastOpener = null;

    function setOpen(open) {
      if (open) {
        menuLastOpener = document.activeElement;
      }
      menuToggle.classList.toggle("is-open", open);
      menuRoot.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
      menuToggle.setAttribute("aria-label", open ? closeLabel : openLabel);
      menuRoot.setAttribute("aria-hidden", open ? "false" : "true");
      if (open) {
        menuRoot.removeAttribute("inert");
        if (firstLink) firstLink.focus({ preventScroll: true });
      } else {
        menuRoot.setAttribute("inert", "");
        var back = menuLastOpener;
        if (back && typeof back.focus === "function") {
          back.focus({ preventScroll: true });
        } else {
          menuToggle.focus({ preventScroll: true });
        }
      }
    }

    menuToggle.addEventListener("click", function () {
      setOpen(!menuRoot.classList.contains("is-open"));
    });

    document.querySelectorAll("[data-open-projects-menu]").forEach(function (el) {
      el.addEventListener("click", function () {
        setOpen(true);
      });
    });

    menuRoot.addEventListener("click", function (e) {
      var t = e.target;
      if (t && t.closest && t.closest("[data-menu-close]")) setOpen(false);
      if (t && t.closest && t.closest(".menu-drawer__link")) setOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menuRoot.classList.contains("is-open")) {
        e.preventDefault();
        setOpen(false);
      }
    });
  }

  var headerBar = document.querySelector(".site-header-bar");
  function onScroll() {
    if (!headerBar) return;
    headerBar.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var STAT_NEON_STROKE = 2.25;

  function parseBorderRadiusPx(value) {
    var s = String(value || "").trim();
    var m = s.match(/^([\d.]+)px/);
    return m ? parseFloat(m[1]) : 0;
  }

  function layoutStatNeons() {
    document.querySelectorAll(".stat").forEach(function (stat) {
      var svg = stat.querySelector(".stat__neon");
      var rect = stat.querySelector(".stat__neon-path");
      if (!svg || !rect) return;
      var bw = stat.offsetWidth;
      var bh = stat.offsetHeight;
      if (bw < 2 || bh < 2) return;
      var cs = getComputedStyle(stat);
      var bl = parseFloat(cs.borderLeftWidth) || 0;
      var bt = parseFloat(cs.borderTopWidth) || 0;
      var r = parseBorderRadiusPx(cs.borderTopLeftRadius);
      if (!r) r = parseBorderRadiusPx(cs.borderRadius) || 20;
      var inset = STAT_NEON_STROKE / 2;
      var rw = Math.max(0, bw - STAT_NEON_STROKE);
      var rh = Math.max(0, bh - STAT_NEON_STROKE);
      var rxy = Math.min(r, rw / 2, rh / 2);
      svg.style.left = -bl + "px";
      svg.style.top = -bt + "px";
      svg.style.width = bw + "px";
      svg.style.height = bh + "px";
      svg.setAttribute("width", String(bw));
      svg.setAttribute("height", String(bh));
      rect.setAttribute("x", String(inset));
      rect.setAttribute("y", String(inset));
      rect.setAttribute("width", String(rw));
      rect.setAttribute("height", String(rh));
      rect.setAttribute("rx", String(rxy));
      rect.setAttribute("ry", String(rxy));
    });
  }

  layoutStatNeons();
  requestAnimationFrame(layoutStatNeons);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(layoutStatNeons);
  }
  window.addEventListener("resize", layoutStatNeons, { passive: true });
  if ("ResizeObserver" in window) {
    var statNeonRo = new ResizeObserver(function () {
      layoutStatNeons();
    });
    document.querySelectorAll(".stat").forEach(function (el) {
      statNeonRo.observe(el);
    });
  }

  var statValues = document.querySelectorAll(".stat__value[data-count]");
  if (statValues.length && "IntersectionObserver" in window) {
    function animateValue(el, target, duration) {
      var start = 0;
      var startTime = null;
      function step(ts) {
        if (!startTime) startTime = ts;
        var p = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(start + (target - start) * eased));
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var raw = el.getAttribute("data-count");
          var target = raw ? parseInt(raw, 10) : 0;
          if (!isNaN(target) && target > 0) animateValue(el, target, 1200);
          obs.unobserve(el);
        });
      },
      { threshold: 0.35 }
    );

    statValues.forEach(function (el) {
      observer.observe(el);
    });
  } else if (statValues.length) {
    statValues.forEach(function (el) {
      var raw = el.getAttribute("data-count");
      var n = raw ? parseInt(raw, 10) : 0;
      if (!isNaN(n)) el.textContent = String(n);
    });
  }

  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    var revOb = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revOb.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    );
    reveals.forEach(function (el) {
      revOb.observe(el);
    });
  } else if (reveals.length) {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }
})();
