/* ==========================================================================
   SILESIA — Avis Google en direct (page avis.html)

   Méthode officielle : Google Maps JavaScript API, classe Place (Places API New).
   - Les avis ne sont JAMAIS copiés sur le site : les conditions de Google l'interdisent.
     Ils sont lus en direct à chaque affichage, donc toujours à jour.
   - Rien n'est chargé depuis Google avant le clic du visiteur (respect de la vie privée).
     S'il coche « Mémoriser mon choix », sa préférence est gardée dans son navigateur.
   - Google transmet au maximum 5 avis, triés par pertinence.
   - Chaque avis affiche son auteur (nom, photo, lien) et renvoie vers Google Maps,
     comme l'exigent les règles d'attribution de Google.
   Configuration : attributs data-place-id et data-api-key dans avis.html.
   ========================================================================== */
(function () {
  "use strict";

  var root = document.querySelector("[data-reviews]");
  if (!root) return;

  var placeId = (root.getAttribute("data-place-id") || "").trim();
  var apiKey = (root.getAttribute("data-api-key") || "").trim();
  var STORE_KEY = "silesia-avis-google";
  var loading = false;

  /* Liens « Lire les avis » et « Laisser un avis » : plus précis si le Place ID est connu */
  if (placeId) {
    document.querySelectorAll("[data-review-write]").forEach(function (a) {
      a.href = "https://search.google.com/local/writereview?placeid=" + encodeURIComponent(placeId);
    });
    document.querySelectorAll("[data-review-maps]").forEach(function (a) {
      a.href += "&query_place_id=" + encodeURIComponent(placeId);
    });
  }

  function show(state) {
    root.querySelectorAll("[data-reviews-state]").forEach(function (el) {
      el.hidden = el.getAttribute("data-reviews-state") !== state;
    });
  }

  function storage(action, value) {
    try {
      if (action === "get") return window.localStorage.getItem(STORE_KEY);
      if (action === "set") window.localStorage.setItem(STORE_KEY, value);
      if (action === "remove") window.localStorage.removeItem(STORE_KEY);
    } catch (e) { /* stockage indisponible (navigation privée…) : sans conséquence */ }
    return null;
  }

  if (!placeId || !apiKey) return;   // pas encore configuré : la page garde ses liens vers Google Maps

  /* ---------------------------------------------------------------- Affichage */
  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function stars(rating, label) {
    var s = el("span", "stars");
    s.style.setProperty("--rating", String(rating || 0));
    if (label) { s.setAttribute("role", "img"); s.setAttribute("aria-label", label); }
    else s.setAttribute("aria-hidden", "true");
    return s;
  }

  function fr(n) {
    return Number(n).toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }

  function externalLink(href, text, cls) {
    var a = el("a", cls, text);
    a.href = href; a.target = "_blank"; a.rel = "noopener";
    return a;
  }

  function render(place) {
    var mapsUrl = place.googleMapsURI || root.querySelector("[data-review-maps]").href;

    /* Résumé : note moyenne et nombre d'avis */
    var summary = root.querySelector("[data-reviews-summary]");
    summary.textContent = "";
    if (place.rating) {
      var score = el("div", "reviews-summary__score");
      score.appendChild(el("span", "reviews-summary__note", fr(place.rating)));
      var side = el("div");
      side.appendChild(stars(place.rating, "Note moyenne : " + fr(place.rating) + " sur 5"));
      side.appendChild(el("span", "reviews-summary__count",
        (place.userRatingCount || 0) + " avis sur Google"));
      score.appendChild(side);
      summary.appendChild(score);
    }
    var actions = el("div", "reviews-actions");
    actions.appendChild(externalLink(mapsUrl, "Voir tous les avis", "btn btn--outline btn--sm"));
    actions.appendChild(externalLink("https://search.google.com/local/writereview?placeid=" + encodeURIComponent(placeId),
      "Laisser un avis", "btn btn--primary btn--sm"));
    summary.appendChild(actions);

    /* Liste des avis (5 au maximum, transmis par Google) */
    var list = root.querySelector("[data-reviews-list]");
    list.textContent = "";
    var reviews = place.reviews || [];
    if (!reviews.length) {
      list.appendChild(el("li", "review", "Aucun avis à afficher pour le moment."));
    }
    reviews.forEach(function (r) {
      var author = r.authorAttribution || {};
      var li = el("li", "review");

      var head = el("div", "review__head");
      if (author.photoURI) {
        var img = el("img", "review__avatar");
        img.src = author.photoURI; img.alt = ""; img.width = 44; img.height = 44;
        img.loading = "lazy"; img.referrerPolicy = "no-referrer";
        head.appendChild(img);
      } else {
        head.appendChild(el("span", "review__avatar review__avatar--initial",
          (author.displayName || "?").trim().charAt(0).toUpperCase()));
      }
      var who = el("div");
      var name = author.uri ? externalLink(author.uri, author.displayName || "Utilisateur Google", "review__author")
                            : el("span", "review__author", author.displayName || "Utilisateur Google");
      who.appendChild(name);
      var meta = el("span", "review__meta");
      meta.appendChild(stars(r.rating, "Note : " + (r.rating || 0) + " sur 5"));
      if (r.relativePublishTimeDescription) meta.appendChild(el("span", null, r.relativePublishTimeDescription));
      who.appendChild(meta);
      head.appendChild(who);
      li.appendChild(head);

      var text = typeof r.text === "string" ? r.text : (r.text && r.text.text) || "";
      if (text) {
        var p = el("p", "review__text is-clamped", text);
        li.appendChild(p);
        var more = el("button", "link-button review__more", "Lire la suite");
        more.type = "button"; more.hidden = true;
        more.addEventListener("click", function () {
          var open = p.classList.toggle("is-clamped") === false;
          more.textContent = open ? "Réduire" : "Lire la suite";
        });
        li.appendChild(more);
        requestAnimationFrame(function () { more.hidden = p.scrollHeight <= p.clientHeight + 2; });
      }

      li.appendChild(externalLink(r.googleMapsURI || mapsUrl, "Voir cet avis sur Google Maps", "review__link"));
      list.appendChild(li);
    });

    var forget = root.querySelector("[data-reviews-forget]");
    forget.hidden = storage("get") !== "1";
    show("loaded");
  }

  /* ---------------------------------------------------------------- Chargement */
  function fail(err) {
    if (err) console.error("[Silesia] Avis Google :", err);
    loading = false;
    show("error");
  }

  function fetchPlace() {
    google.maps.importLibrary("places").then(function (lib) {
      var place = new lib.Place({ id: placeId, requestedLanguage: "fr" });
      return place.fetchFields({ fields: ["displayName", "rating", "userRatingCount", "reviews", "googleMapsURI"] })
        .then(function () { render(place); });
    }).catch(fail);
  }

  function load() {
    if (loading) return;
    loading = true;
    show("loading");
    if (window.google && window.google.maps && window.google.maps.importLibrary) { fetchPlace(); return; }

    var timer = setTimeout(function () { fail("délai dépassé"); }, 15000);
    window.__silesiaAvisPret = function () { clearTimeout(timer); fetchPlace(); };
    window.gm_authFailure = function () { clearTimeout(timer); fail("clé d'API refusée par Google"); };

    var s = document.createElement("script");
    s.src = "https://maps.googleapis.com/maps/api/js?key=" + encodeURIComponent(apiKey) +
            "&v=weekly&language=fr&region=FR&loading=async&callback=__silesiaAvisPret";
    s.async = true;
    s.onerror = function () { clearTimeout(timer); fail("script Google inaccessible"); };
    document.head.appendChild(s);
  }

  root.querySelector("[data-reviews-load]").addEventListener("click", function () {
    if (root.querySelector("[data-reviews-remember]").checked) storage("set", "1");
    load();
  });
  root.querySelector("[data-reviews-forget]").addEventListener("click", function (e) {
    storage("remove");
    e.currentTarget.hidden = true;
    e.currentTarget.insertAdjacentText("afterend", "C'est noté : les avis ne seront plus chargés automatiquement.");
  });

  if (storage("get") === "1") load();
  else show("consent");
})();
