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

  /* ---------- Tab navigation (hash-routed views) ---------- */
  const tabViews = Array.from(document.querySelectorAll(".tab"));
  const tabNames = tabViews.map((t) => t.dataset.tab);

  function showTab(name) {
    const id = tabNames.includes(name) ? name : "home";
    tabViews.forEach((t) => t.classList.toggle("is-active", t.dataset.tab === id));
    document.querySelectorAll(".nav__link").forEach((a) => {
      a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
    });
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }

  function route() {
    showTab((location.hash || "#home").slice(1));
  }
  window.addEventListener("hashchange", route);
  route();

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

  /* ---------- Scroll reveal (fade in once; stays visible) ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

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

  /* ---------- SMS alert on form submit (Twilio Function) ----------
     Set SMS_ENDPOINT to the deployed Twilio Function URL to enable.
     Fire-and-forget: if it fails, the form submission still goes
     through to FormSubmit for email delivery. */
  const SMS_ENDPOINT = ""; // e.g. "https://bubba-sms-1234.twil.io/notify"
  const bookingForm = document.getElementById("bookingForm");
  if (bookingForm && SMS_ENDPOINT) {
    bookingForm.addEventListener("submit", () => {
      const data = new FormData(bookingForm);
      const payload = new URLSearchParams();
      ["Name", "Email", "Phone", "Preferred Placement", "Tattoo Idea"].forEach((k) => {
        payload.append(k, data.get(k) || "");
      });
      if (navigator.sendBeacon) {
        navigator.sendBeacon(SMS_ENDPOINT, payload);
      } else {
        fetch(SMS_ENDPOINT, { method: "POST", body: payload, keepalive: true }).catch(() => {});
      }
    });
  }

  /* ---------- Footer year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
