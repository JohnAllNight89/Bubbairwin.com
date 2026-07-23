/* Bubba Irwin Tattoo — site interactions */
(function () {
  "use strict";

  /* ---------- Sticky nav: scrolled state + mobile toggle ---------- */
  const nav = document.querySelector(".nav");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  window.addEventListener("scroll", () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 40);
  }, { passive: true });

  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  navLinks.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      navLinks.classList.remove("is-open");
      navToggle.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- Scroll-spy: highlight active section link ---------- */
  const sections = ["gallery", "bio", "affiliations", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const linkFor = {};
  document.querySelectorAll(".nav__link").forEach((a) => {
    linkFor[a.getAttribute("href").slice(1)] = a;
  });

  function setActive(id) {
    document.querySelectorAll(".nav__link").forEach((a) => a.classList.remove("is-active"));
    if (linkFor[id]) linkFor[id].classList.add("is-active");
  }

  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => spy.observe(s));

  window.addEventListener("scroll", () => {
    if (window.scrollY < 200) setActive("top");
  }, { passive: true });

  /* ---------- Gallery filters ---------- */
  const chips = document.querySelectorAll(".chip");
  const items = Array.from(document.querySelectorAll(".gallery__item"));

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      const filter = chip.dataset.filter;
      items.forEach((item) => {
        item.classList.toggle("is-hidden", filter !== "all" && item.dataset.style !== filter);
      });
    });
  });

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  let currentIndex = -1;

  function visibleItems() {
    return items.filter((i) => !i.classList.contains("is-hidden"));
  }

  function openLightbox(item) {
    const vis = visibleItems();
    currentIndex = vis.indexOf(item);
    showItem(vis, currentIndex);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }

  const lightboxDesc = document.getElementById("lightboxDesc");

  function showItem(vis, index) {
    const item = vis[index];
    if (!item) return;
    const img = item.querySelector("img");
    const cap = item.querySelector(".gallery__caption span");
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = cap ? cap.textContent.trim() : "";
    if (lightboxDesc) lightboxDesc.textContent = item.dataset.desc || "";
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
  }

  function step(delta) {
    const vis = visibleItems();
    if (!vis.length) return;
    currentIndex = (currentIndex + delta + vis.length) % vis.length;
    showItem(vis, currentIndex);
  }

  items.forEach((item) => {
    item.addEventListener("click", () => openLightbox(item));
  });
  document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
  document.getElementById("lightboxPrev").addEventListener("click", () => step(-1));
  document.getElementById("lightboxNext").addEventListener("click", () => step(1));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  /* ---------- Scroll reveal: fade in and back out for depth ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-visible", entry.isIntersecting);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -4% 0px" });
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------- Ember cursor trail ---------- */
  const canvas = document.getElementById("emberCanvas");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  if (canvas && finePointer && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    let embers = [];
    let running = false;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });

    window.addEventListener("mousemove", (e) => {
      for (let i = 0; i < 2; i++) {
        embers.push({
          x: e.clientX + (Math.random() - 0.5) * 6,
          y: e.clientY + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 0.7,
          vy: -0.4 - Math.random() * 0.9,
          size: 1 + Math.random() * 2.2,
          life: 1,
          decay: 0.02 + Math.random() * 0.025,
          hue: 18 + Math.random() * 32   /* fiery orange → yellow */
        });
      }
      if (embers.length > 160) embers = embers.slice(-160);
      if (!running) { running = true; requestAnimationFrame(tick); }
    }, { passive: true });

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      embers = embers.filter((p) => p.life > 0);
      for (const p of embers) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.01;
        p.life -= p.decay;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = "hsla(" + p.hue + ", 100%, " + (50 + p.life * 15) + "%, " + (p.life * 0.55) + ")";
        ctx.fill();
      }
      if (embers.length) {
        requestAnimationFrame(tick);
      } else {
        running = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }

  /* ---------- Booking form: file limits ---------- */
  const fileInput = document.getElementById("f-refs");
  const fileHint = document.getElementById("fileHint");
  const MAX_FILES = 5;
  const MAX_TOTAL_MB = 20;

  if (fileInput) {
    fileInput.addEventListener("change", () => {
      const files = Array.from(fileInput.files || []);
      if (files.length > MAX_FILES) {
        fileHint.textContent = "Please attach no more than " + MAX_FILES + " images.";
        fileInput.value = "";
        return;
      }
      const totalMB = files.reduce((sum, f) => sum + f.size, 0) / (1024 * 1024);
      if (totalMB > MAX_TOTAL_MB) {
        fileHint.textContent = "Attachments are too large (limit " + MAX_TOTAL_MB + " MB total). Try smaller images.";
        fileInput.value = "";
        return;
      }
      fileHint.textContent = files.length
        ? files.length + " image" + (files.length > 1 ? "s" : "") + " attached."
        : "Attach photos, sketches, or examples of styles you like.";
    });
  }

  /* ---------- Footer year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
