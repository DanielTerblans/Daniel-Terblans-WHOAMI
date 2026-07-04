/**
 * Resume site behaviour.
 *
 * Security notes:
 * - No use of eval, innerHTML with untrusted input, or document.write.
 * - Only textContent / createElement are used to build DOM content.
 * - The contact email is assembled at runtime (not present as plain text
 *   in the HTML source) as a light deterrent against basic scraping bots.
 * - No external network requests, no third-party scripts.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "site-theme";

  /* ---------- Theme toggle (persisted in localStorage) ---------- */
  function initTheme() {
    var root = document.documentElement;
    var toggleBtn = document.getElementById("themeToggle");
    var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

    var stored = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      stored = null; // localStorage may be unavailable (privacy mode); fail gracefully
    }

    var initial = stored === "dark" || stored === "light" ? stored : (prefersDark ? "dark" : "light");
    applyTheme(initial);

    if (toggleBtn) {
      toggleBtn.addEventListener("click", function () {
        var current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
        var next = current === "dark" ? "light" : "dark";
        applyTheme(next);
        try {
          window.localStorage.setItem(STORAGE_KEY, next);
        } catch (e) {
          /* ignore storage errors */
        }
      });
    }

    function applyTheme(theme) {
      if (theme === "dark") {
        root.setAttribute("data-theme", "dark");
        if (toggleBtn) toggleBtn.textContent = "☀️";
      } else {
        root.removeAttribute("data-theme");
        if (toggleBtn) toggleBtn.textContent = "🌙";
      }
    }
  }

  /* ---------- Mobile nav toggle ---------- */
  function initNav() {
    var navToggle = document.getElementById("navToggle");
    var navLinks = document.getElementById("navLinks");
    if (!navToggle || !navLinks) return;

    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Typing effect for hero tagline ---------- */
  function initTyping() {
    var el = document.getElementById("typedTagline");
    if (!el) return;

    var phrases = [
      "Kitchen Hand at K&K Austrian Coffee House",
      "Exploring Cyber Security & Robotics",
      "Working towards my QCE"
    ];

    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      el.textContent = phrases[0];
      return;
    }

    var phraseIndex = 0;
    var charIndex = 0;
    var deleting = false;

    var textSpan = document.createElement("span");
    var cursorSpan = document.createElement("span");
    cursorSpan.className = "cursor";
    cursorSpan.setAttribute("aria-hidden", "true");
    el.textContent = "";
    el.appendChild(textSpan);
    el.appendChild(cursorSpan);

    function tick() {
      var current = phrases[phraseIndex];

      if (!deleting) {
        charIndex++;
        textSpan.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 1600);
          return;
        }
      } else {
        charIndex--;
        textSpan.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }

      setTimeout(tick, deleting ? 40 : 70);
    }

    tick();
  }

  /* ---------- Scroll reveal for sections ---------- */
  function initReveal() {
    var sections = document.querySelectorAll(".reveal");
    if (!sections.length) return;

    if (!("IntersectionObserver" in window)) {
      sections.forEach(function (s) { s.classList.add("in-view"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ---------- Build email link at runtime (basic anti-scrape) ---------- */
  function initEmail() {
    var container = document.getElementById("emailLink");
    if (!container) return;

    var user = "daniel.terblans";
    var domain = "gmail.com";
    var address = user + "@" + domain;

    var link = document.createElement("a");
    link.href = "mailto:" + address;
    link.textContent = address;
    link.rel = "noopener noreferrer";

    container.textContent = "";
    container.appendChild(link);
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    var yearEl = document.getElementById("year");
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initNav();
    initTyping();
    initReveal();
    initEmail();
    initYear();
  });
})();
