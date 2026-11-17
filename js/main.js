/* ============================================================
   Living Acres by ESS — site behaviour
   ------------------------------------------------------------
   >>> SET YOUR BUSINESS NUMBER HERE (international format, no + or spaces)
   ============================================================ */
const FARM_PHONE = "254728634531"; // Living Acres WhatsApp / phone number

(function () {
  "use strict";

  /* ---- WhatsApp + phone links ---- */
  document.querySelectorAll("[data-wa]").forEach((el) => {
    const msg = el.getAttribute("data-wa") || "Hello Living Acres";
    el.href = `https://wa.me/${FARM_PHONE}?text=${encodeURIComponent(msg)}`;
    el.target = "_blank";
    el.rel = "noopener";
  });
  document.querySelectorAll("[data-tel]").forEach((el) => {
    el.href = `tel:+${FARM_PHONE}`;
  });

  /* ---- Year ---- */
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---- Mobile nav ---- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  const setNav = (open) => {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  toggle.addEventListener("click", () => setNav(!nav.classList.contains("open")));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setNav(false)));

  /* ---- Active nav link on scroll ---- */
  const links = [...nav.querySelectorAll('a[href^="#"]:not(.btn)')];
  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const id = "#" + e.target.id;
        links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === id));
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  /* ---- Product card videos: play on hover (desktop) or when in view (touch) ---- */
  const canHover = window.matchMedia("(hover: hover)").matches;
  document.querySelectorAll(".product-media.has-video").forEach((wrap) => {
    const v = wrap.querySelector("video");
    const play = () => { v.play().then(() => wrap.classList.add("playing")).catch(() => {}); };
    const stop = () => { v.pause(); wrap.classList.remove("playing"); };
    if (canHover) {
      const card = wrap.closest(".product-card");
      card.addEventListener("mouseenter", play);
      card.addEventListener("mouseleave", stop);
    } else {
      new IntersectionObserver(
        ([e]) => (e.isIntersecting ? play() : stop()),
        { threshold: 0.6 }
      ).observe(wrap);
    }
  });

  /* ---- Modal: video ("Watch our story") + gallery lightbox ---- */
  const modal = document.getElementById("videoModal");
  const modalVideo = modal.querySelector("video");
  let modalImg = null;

  const openModal = () => (modal.showModal ? modal.showModal() : modal.setAttribute("open", ""));
  const closeModal = () => {
    modalVideo.pause();
    modal.close ? modal.close() : modal.removeAttribute("open");
  };

  document.querySelectorAll("[data-video]").forEach((btn) => {
    btn.addEventListener("click", () => {
      modal.classList.remove("is-image");
      if (modalImg) modalImg.hidden = true;
      modalVideo.hidden = false;
      modalVideo.src = btn.getAttribute("data-video");
      openModal();
      modalVideo.play().catch(() => {});
    });
  });

  document.querySelectorAll(".gallery figure").forEach((fig) => {
    fig.addEventListener("click", () => {
      const src = fig.querySelector("img");
      if (!modalImg) {
        modalImg = document.createElement("img");
        modal.appendChild(modalImg);
      }
      modalVideo.pause();
      modalVideo.hidden = true;
      modalImg.hidden = false;
      modalImg.src = src.src;
      modalImg.alt = src.alt;
      modal.classList.add("is-image");
      openModal();
    });
  });

  modal.querySelector(".modal-close").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  modal.addEventListener("close", () => modalVideo.pause());

  /* ---- Reveal on scroll ---- */
  const revealEls = document.querySelectorAll(
    ".product-card, .split-card, .standard, .farm-media, .farm-copy, .gallery figure, .testimonial-band"
  );
  revealEls.forEach((el) => el.classList.add("reveal"));
  const rev = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); rev.unobserve(e.target); }
    }),
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => rev.observe(el));
})();
