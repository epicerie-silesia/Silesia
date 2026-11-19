/* ==========================================================================
   SILESIA — scripts du site (sans dépendance, ~3 Ko)
   1. Menu mobile
   2. En-tête au défilement
   3. Apparitions douces au défilement
   4. Carte interactive chargée uniquement sur demande (respect de la vie privée)
   5. Mise en évidence du jour courant dans les horaires
   6. Sommaire de la page Histoire (chapitre actif)
   7. Année du copyright
   ========================================================================== */
(function () {
  "use strict";

  var doc = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 1. Menu mobile -------------------------------------------------------- */
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.querySelector(".visually-hidden").textContent = open ? "Fermer le menu" : "Ouvrir le menu";
      nav.classList.toggle("is-open", open);
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
    });
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("is-open") && !nav.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
    });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    window.matchMedia("(min-width: 1024px)").addEventListener("change", function () { setOpen(false); });
  }

  /* 2. En-tête au défilement ---------------------------------------------- */
  var header = document.querySelector("[data-header]");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* 3. Apparitions au défilement ------------------------------------------ */
  var revealables = document.querySelectorAll("[data-reveal]");
  if (!reduceMotion && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* 4. Carte : l'iframe OpenStreetMap n'est chargée qu'après un clic -------- */
  document.querySelectorAll("[data-map-load]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var box = btn.closest("[data-map]");
      var iframe = document.createElement("iframe");
      iframe.src = box.getAttribute("data-map-src");
      iframe.title = "Carte interactive : localisation de l'épicerie Silesia à Morangis";
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer";
      box.innerHTML = "";
      box.appendChild(iframe);
    });
  });

  /* 5. Horaires : jour courant -------------------------------------------- */
  var today = new Date().getDay(); // 0 = dimanche
  document.querySelectorAll("[data-day]").forEach(function (row) {
    if (Number(row.getAttribute("data-day")) === today) {
      row.classList.add("is-today");
      row.querySelector("th").insertAdjacentHTML("beforeend", ' <span class="visually-hidden">(aujourd’hui)</span>');
    }
  });

  /* 6. Sommaire de la page Histoire ---------------------------------------- */
  var chapterLinks = document.querySelectorAll(".chapters a[href^='#']");
  if (chapterLinks.length && "IntersectionObserver" in window) {
    var byId = {};
    chapterLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && byId[entry.target.id]) {
          chapterLinks.forEach(function (a) { a.classList.remove("is-active"); });
          var link = byId[entry.target.id];
          link.classList.add("is-active");
          var bar = link.closest("ul");
          bar.scrollTo({ left: link.offsetLeft - (bar.clientWidth - link.offsetWidth) / 2, behavior: reduceMotion ? "auto" : "smooth" });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(byId).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) spy.observe(section);
    });
  }

  /* 8. Visionneuse photo (galerie « La boutique en images ») ---------------
        Sans JavaScript, un clic ouvre simplement la photo en grand. */
  var dialog = document.querySelector("[data-lightbox-dialog]");
  var shots = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  if (dialog && shots.length && typeof dialog.showModal === "function") {
    var bigImg = dialog.querySelector(".lightbox__img");
    var caption = dialog.querySelector(".lightbox__caption");
    var current = 0;
    var showShot = function (i) {
      current = (i + shots.length) % shots.length;
      var thumb = shots[current].querySelector("img");
      bigImg.src = shots[current].getAttribute("href");
      bigImg.alt = thumb.alt;
      caption.textContent = thumb.alt + " (" + (current + 1) + "/" + shots.length + ")";
    };
    shots.forEach(function (a, i) {
      a.addEventListener("click", function (e) { e.preventDefault(); showShot(i); dialog.showModal(); });
    });
    dialog.querySelector("[data-lightbox-close]").addEventListener("click", function () { dialog.close(); });
    dialog.querySelector("[data-lightbox-prev]").addEventListener("click", function () { showShot(current - 1); });
    dialog.querySelector("[data-lightbox-next]").addEventListener("click", function () { showShot(current + 1); });
    dialog.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") showShot(current - 1);
      if (e.key === "ArrowRight") showShot(current + 1);
    });
    dialog.addEventListener("click", function (e) {   // clic sur le fond sombre : fermeture
      if (e.target === dialog || e.target.classList.contains("lightbox__figure")) dialog.close();
    });
    dialog.addEventListener("close", function () { shots[current].focus(); });
  }

  /* 7. Année du copyright -------------------------------------------------- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  doc.classList.add("js-ready");
})();
