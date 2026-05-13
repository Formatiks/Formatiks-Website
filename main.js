(function () {
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  var menuToggle = document.getElementById("menu-toggle");
  var menuRoot = document.getElementById("projects-menu");
  if (menuToggle && menuRoot) {
    var openLabel = "Apri menu progetti";
    var closeLabel = "Chiudi menu progetti";
    var firstLink = menuRoot.querySelector(".menu-drawer__link");

    function setOpen(open) {
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
        menuToggle.focus({ preventScroll: true });
      }
    }

    menuToggle.addEventListener("click", function () {
      setOpen(!menuRoot.classList.contains("is-open"));
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

  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

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
})();
