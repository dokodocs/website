(function () {
  "use strict";

  var header = document.getElementById("site-header");
  var toggle = document.getElementById("nav-toggle");
  var navLinks = document.getElementById("nav-links");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Sticky header shadow
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 4);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile nav toggle
  if (toggle && navLinks) {
    toggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navLinks.classList.contains("open")) {
        navLinks.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  // Scroll-reveal
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  }

  // Active-link highlighting for on-page sections
  var sections = Array.prototype.slice.call(document.querySelectorAll("main [id]"));
  var navAnchors = navLinks
    ? Array.prototype.slice.call(navLinks.querySelectorAll('a[href^="#"]'))
    : [];
  if (sections.length && navAnchors.length && "IntersectionObserver" in window) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var id = entry.target.id;
          var link = navAnchors.filter(function (a) { return a.getAttribute("href") === "#" + id; })[0];
          if (!link) return;
          if (entry.isIntersecting) {
            navAnchors.forEach(function (a) { a.classList.remove("active"); });
            link.classList.add("active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
