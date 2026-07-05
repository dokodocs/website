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

  // iOS "notify me" form — posts to the same Google Sheet endpoint,
  // tagged message = "ios waiting" so it's distinguishable in the sheet.
  var notify = document.getElementById("notify-form");
  if (notify) {
    var nStatus = document.getElementById("notify-status");
    var nBtn = notify.querySelector("button[type=submit]");
    var setN = function (msg, cls) {
      if (!nStatus) return;
      nStatus.textContent = msg;
      nStatus.className = "form-status" + (cls ? " " + cls : "");
    };
    notify.addEventListener("submit", function (e) {
      e.preventDefault();
      var endpoint = notify.getAttribute("data-endpoint") || "";
      if (!notify.checkValidity()) {
        notify.reportValidity();
        return;
      }
      if (!endpoint || endpoint.indexOf("PASTE_") === 0) {
        setN("Couldn't submit right now — email dokodocsnepal@gmail.com.", "err");
        return;
      }
      if (nBtn) {
        nBtn.disabled = true;
        nBtn.textContent = "Sending…";
      }
      setN("Sending…", "");
      fetch(endpoint, { method: "POST", body: new FormData(notify) })
        .then(function () {
          setN("Thanks! We'll email you when iOS launches. 🙏", "ok");
          notify.reset(); // clears email; hidden message resets to "ios waiting"
        })
        .catch(function () {
          setN("Something went wrong. Please try again.", "err");
        })
        .finally(function () {
          if (nBtn) {
            nBtn.disabled = false;
            nBtn.textContent = "Notify me";
          }
        });
    });
  }

  // Contact form -> Google Apps Script Web App (writes to the Sheet)
  var cform = document.getElementById("contact-form");
  if (cform) {
    var status = document.getElementById("cf-status");
    var submitBtn = document.getElementById("cf-submit");
    var setStatus = function (msg, cls) {
      if (!status) return;
      status.textContent = msg;
      status.className = "form-status" + (cls ? " " + cls : "");
    };
    cform.addEventListener("submit", function (e) {
      e.preventDefault();
      var endpoint = cform.getAttribute("data-endpoint") || "";
      // Honeypot: silently drop bot submissions
      var hp = cform.querySelector('input[name="_gotcha"]');
      if (hp && hp.value) return;
      if (!cform.checkValidity()) {
        cform.reportValidity();
        return;
      }
      if (!endpoint || endpoint.indexOf("PASTE_") === 0) {
        setStatus(
          "Form isn't connected yet. Please email dokodocsnepal@gmail.com for now.",
          "err"
        );
        return;
      }
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
      }
      setStatus("Sending…", "");
      fetch(endpoint, { method: "POST", body: new FormData(cform) })
        .then(function () {
          // Apps Script returns an opaque (no-CORS-friendly) response; treat
          // a completed request as success.
          setStatus("Thanks! Your message has been received. 🙏", "ok");
          cform.reset();
        })
        .catch(function () {
          setStatus(
            "Something went wrong. Please try again, or email dokodocsnepal@gmail.com.",
            "err"
          );
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Send message";
          }
        });
    });
  }

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
