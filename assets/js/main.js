/* ==========================================================================
   IMPRESIVE — shared site behavior + injected header/footer
   Header & footer are rendered here so every page stays in sync and new
   pages only need a <body data-page="..."> attribute.
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- SEO meta injection (canonical + OpenGraph + Twitter + JSON-LD) ----------
     NOTE: SITE_URL is a placeholder — update to the real domain once registered.
     Social scrapers don't run JS, so when a real domain + content exist, promote these
     to static per-page <head> tags. Google does process JS-injected canonical/meta. */
  var SITE_URL = "https://www.impresive.org";
  (function injectSEO() {
    var head = document.head;
    var path = location.pathname.split("/").pop() || "index.html";
    if (!/\.html?$/.test(path)) path = "index.html";
    var canonical = SITE_URL + "/" + (path === "index.html" ? "" : path);
    var title = document.title;
    var descEl = head.querySelector('meta[name="description"]');
    var desc = descEl ? descEl.getAttribute("content") : "";
    var image = SITE_URL + "/assets/img/favicon.svg";

    function meta(attr, key, val) {
      if (!val) return;
      var el = head.querySelector("meta[" + attr + '="' + key + '"]');
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); head.appendChild(el); }
      el.setAttribute("content", val);
    }
    if (!head.querySelector('link[rel="canonical"]')) {
      var l = document.createElement("link"); l.rel = "canonical"; l.href = canonical; head.appendChild(l);
    }
    function headLink(rel, href, extra) {
      if (head.querySelector('link[rel="' + rel + '"]')) return;
      var el = document.createElement("link"); el.rel = rel; el.href = href;
      if (extra) Object.keys(extra).forEach(function (k) { el.setAttribute(k, extra[k]); });
      head.appendChild(el);
    }
    headLink("manifest", "site.webmanifest");
    headLink("apple-touch-icon", "assets/img/favicon.svg");
    /* mask-icon (Safari pinned tab) + theme-color */
    headLink("mask-icon", "assets/img/favicon.svg", { color: "#0A2540" });
    meta("name", "theme-color", "#0A2540");
    meta("property", "og:type", "website");
    meta("property", "og:site_name", "IMPRESIVE");
    meta("property", "og:title", title);
    meta("property", "og:description", desc);
    meta("property", "og:url", canonical);
    meta("property", "og:image", image);
    meta("name", "twitter:card", "summary");
    meta("name", "twitter:title", title);
    meta("name", "twitter:description", desc);
    meta("name", "twitter:image", image);

    if (!head.querySelector('script[type="application/ld+json"]')) {
      var ld = document.createElement("script");
      ld.type = "application/ld+json";
      ld.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "IMPRESIVE",
        "alternateName": "International Multi-database study PREparedness",
        "url": SITE_URL,
        "logo": image,
        "description": "An international multi-database study preparedness platform enabling timely evaluation of diseases and treatments through database standardization, integration, visualization and distributed real-world evidence generation."
      });
      head.appendChild(ld);
    }
  })();

  /* ---------- shared markup ---------- */
  var MARK = '<svg class="mark" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="bm-%ID%" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0063C3"/><stop offset="1" stop-color="#14B8A6"/></linearGradient></defs><rect width="64" height="64" rx="14" fill="%BG%"/><g stroke="url(#bm-%ID%)" stroke-width="2.4" fill="none" opacity=".9"><line x1="16" y1="46" x2="32" y2="32"/><line x1="32" y1="32" x2="48" y2="18"/><line x1="32" y1="32" x2="48" y2="44"/><line x1="16" y1="46" x2="30" y2="50"/></g><g fill="url(#bm-%ID%)"><circle cx="16" cy="46" r="5"/><circle cx="32" cy="32" r="6"/><circle cx="48" cy="18" r="5"/><circle cx="48" cy="44" r="4.5"/><circle cx="30" cy="51" r="3.5"/></g></svg>';
  function mark(id, bg) { return MARK.replace(/%ID%/g, id).replace("%BG%", bg || "#0A2540"); }

  /* primary nav + "Explore more" dropdown (only built pages are listed) */
  var PRIMARY = [
    { href: "index.html", label: "Home", page: "home" },
    { href: "about.html", label: "About", page: "about" },
    { href: "why.html", label: "Why Multi-database", page: "why" },
    { href: "methods.html", label: "Methods & Technology", page: "methods" },
    { href: "databases.html", label: "Databases", page: "databases" }
  ];
  /* Only built pages are listed here; new pages are added as they ship. */
  var MORE = [
    { href: "mission.html", label: "Mission & Roadmap", page: "mission" },
    { href: "visualization.html", label: "Visualization & Dashboards", page: "visualization" },
    { href: "projects.html", label: "Projects & Achievements", page: "projects" },
    { href: "resources.html", label: "Resources & Simulation Lab", page: "resources" },
    { href: "network.html", label: "Network, Members & Governance", page: "network" },
    { href: "news.html", label: "News & Events", page: "news" },
    { href: "faq.html", label: "FAQ", page: "faq" }
  ];

  function navLink(item, active) {
    return '<a href="' + item.href + '"' + (item.page === active ? ' aria-current="page"' : '') + '>' + item.label + '</a>';
  }

  function buildHeader(active) {
    var moreActive = MORE.some(function (m) { return m.page === active; });
    var primaryHtml = PRIMARY.map(function (i) { return navLink(i, active); }).join("");
    var moreHtml = MORE.map(function (i) { return navLink(i, active); }).join("");
    return '' +
      '<div class="wrap nav">' +
        '<a class="brand" href="index.html" aria-label="IMPRESIVE home">' + mark("h") +
          '<span>IMPRESIVE<small>Multi-database Preparedness</small></span></a>' +
        '<button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="nav-links">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button>' +
        '<nav class="nav-links" id="nav-links" aria-label="Primary">' +
          primaryHtml +
          '<div class="nav-dd' + (moreActive ? ' is-active' : '') + '">' +
            '<button class="nav-dd-toggle" aria-expanded="false" aria-haspopup="true">More' +
              '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></button>' +
            '<div class="nav-dd-menu">' + moreHtml + '</div>' +
          '</div>' +
          '<a href="join.html"' + (active === "join" ? ' aria-current="page"' : '') + '>Join Us</a>' +
          '<a class="btn btn--primary" href="contact.html"' + (active === "contact" ? ' aria-current="page"' : '') + '>Contact</a>' +
        '</nav>' +
      '</div>';
  }

  function buildFooter() {
    return '' +
      '<div class="wrap"><div class="footer-grid">' +
        '<div><div class="fbrand">' + mark("f", "#102a4a") + 'IMPRESIVE</div>' +
          '<p class="full">International Multi-database study PREparedness: Databases Standardization, ' +
          'Integration and Visualization for timely Evaluation on Disease and Treatment.</p></div>' +
        '<div><h4>Explore</h4><ul>' +
          '<li><a href="about.html">About IMPRESIVE</a></li>' +
          '<li><a href="why.html">Why multi-database studies</a></li>' +
          '<li><a href="methods.html">Methods &amp; Technology</a></li>' +
          '<li><a href="databases.html">Databases &amp; Partners</a></li>' +
          '<li><a href="mission.html">Mission &amp; Roadmap</a></li></ul></div>' +
        '<div><h4>Participate</h4><ul>' +
          '<li><a href="join.html">Join us</a></li>' +
          '<li><a href="contact.html">Contact</a></li>' +
          '<li><a href="faq.html">FAQ</a></li>' +
          '<li><a href="join.html#proposal">Submit a proposal</a></li></ul></div>' +
        '<div><h4>Get involved</h4><div class="footer-cta">' +
          '<a href="join.html#data-partners">I am a data partner &rarr;</a>' +
          '<a href="join.html#researchers">I am a researcher &rarr;</a>' +
          '<a href="join.html#decision-partners">Industry / regulatory / policy &rarr;</a></div></div>' +
      '</div>' +
      '<div class="footer-bottom">' +
        '<span>&copy; <span id="year"></span> IMPRESIVE. All rights reserved.</span>' +
        '<span>Prepared databases &middot; Integrated evidence &middot; Timely decisions</span>' +
      '</div></div>';
  }

  /* ---------- accessibility: skip link + main landmark ---------- */
  var mainEl = document.querySelector("main");
  if (mainEl) {
    if (!mainEl.id) mainEl.id = "main";
    mainEl.setAttribute("tabindex", "-1");
    if (!document.querySelector(".skip-link")) {
      var skip = document.createElement("a");
      skip.className = "skip-link";
      skip.href = "#" + mainEl.id;
      skip.textContent = "Skip to content";
      document.body.insertBefore(skip, document.body.firstChild);
    }
  }

  /* ---------- inject header / footer ---------- */
  var active = document.body.getAttribute("data-page") || "";

  var header = document.querySelector(".site-header");
  if (!header) { header = document.createElement("header"); header.className = "site-header";
    document.body.insertBefore(header, document.body.firstChild); }
  header.innerHTML = buildHeader(active);

  var footer = document.querySelector(".site-footer");
  if (!footer) { footer = document.createElement("footer"); footer.className = "site-footer";
    document.body.appendChild(footer); }
  footer.innerHTML = buildFooter();

  /* ---------- mobile nav ---------- */
  var toggle = header.querySelector(".nav-toggle");
  var links = header.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") links.classList.remove("is-open");
    });
  }

  /* ---------- dropdown ---------- */
  var dd = header.querySelector(".nav-dd");
  if (dd) {
    var ddToggle = dd.querySelector(".nav-dd-toggle");
    ddToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = dd.classList.toggle("is-open");
      ddToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", function () { dd.classList.remove("is-open"); });
  }

  /* ---------- sticky header shadow ---------- */
  var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- reveal / counters / readiness bars ---------- */
  var supportsIO = "IntersectionObserver" in window;

  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    if (isNaN(target)) return;
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 1100, start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = (target % 1 === 0 ? Math.round(val) : val.toFixed(1)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  var revealEls = document.querySelectorAll(".reveal");
  var counters = document.querySelectorAll("[data-count]");
  var bars = document.querySelectorAll(".readiness .bar > i");

  if (supportsIO) {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var t = en.target;
        if (t.classList.contains("reveal")) t.classList.add("in");
        if (t.hasAttribute("data-count")) animateCount(t);
        if (t.matches(".readiness .bar > i")) t.style.width = t.getAttribute("data-pct") + "%";
        obs.unobserve(t);
      });
    }, { threshold: 0.18 });
    revealEls.forEach(function (e) { io.observe(e); });
    counters.forEach(function (e) { io.observe(e); });
    bars.forEach(function (e) { io.observe(e); });
  } else {
    revealEls.forEach(function (e) { e.classList.add("in"); });
    counters.forEach(animateCount);
    bars.forEach(function (e) { e.style.width = e.getAttribute("data-pct") + "%"; });
  }

  /* ---------- forms (client-side mailto fallback) ---------- */
  document.querySelectorAll("form[data-mailto]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var to = form.getAttribute("data-mailto");
      var subject = encodeURIComponent(form.getAttribute("data-subject") || "IMPRESIVE enquiry");
      var data = new FormData(form);
      var lines = [];
      data.forEach(function (v, k) { if (v) lines.push(k + ": " + v); });
      var body = encodeURIComponent(lines.join("\n"));
      var status = form.querySelector(".form-status");
      if (status) {
        status.className = "form-status ok show";
        status.textContent = "Thanks — your mail client will open to send this securely. " +
          "(A server-side submission endpoint will be wired up in a later phase.)";
      }
      window.location.href = "mailto:" + to + "?subject=" + subject + "&body=" + body;
    });
  });

  /* ---------- chart tooltips ([data-tip]; native <title> is the no-JS fallback) ---------- */
  (function () {
    var tipEls = document.querySelectorAll("[data-tip]");
    if (!tipEls.length) return;
    var tip = document.createElement("div");
    tip.className = "chart-tip";
    tip.setAttribute("role", "status");
    document.body.appendChild(tip);
    function move(e) {
      var x = e.clientX, y = e.clientY;
      tip.style.left = Math.min(x + 14, window.innerWidth - tip.offsetWidth - 8) + "px";
      tip.style.top = (y + 18) + "px";
    }
    tipEls.forEach(function (el) {
      el.addEventListener("pointerenter", function (e) {
        tip.textContent = el.getAttribute("data-tip");
        tip.classList.add("show");
        move(e);
      });
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", function () { tip.classList.remove("show"); });
    });
  })();

  /* ---------- LEGO illustrations (clean bg + brick objects on every hero) ---------- */
  (function () {
    var OL = 'stroke="#0a2540" stroke-width="2.4" stroke-linejoin="round"';
    function fig(c, l) {
      return '<svg class="lego-fig" viewBox="0 0 90 126" aria-hidden="true">' +
        '<g ' + OL + '>' +
        '<rect x="18" y="96" width="16" height="28" rx="3" fill="' + l + '"/>' +
        '<rect x="40" y="96" width="16" height="28" rx="3" fill="' + l + '"/>' +
        '<rect x="14" y="80" width="46" height="18" rx="3" fill="' + l + '"/>' +
        '<path d="M16 50 H58 L62 84 H12 Z" fill="' + c + '"/>' +
        '<path d="M16 54 C6 60 6 78 13 84 L22 80 C16 72 18 62 25 60 Z" fill="' + c + '"/>' +
        '<path d="M58 54 C68 60 68 78 61 84 L52 80 C58 72 56 62 49 60 Z" fill="' + c + '"/>' +
        '<circle cx="11" cy="84" r="6" fill="#F4C66A"/><circle cx="63" cy="84" r="6" fill="#F4C66A"/>' +
        '<rect x="30" y="14" width="30" height="30" rx="8" fill="#F4C66A"/>' +
        '<ellipse cx="45" cy="14" rx="7" ry="3" fill="#F4C66A"/></g>' +
        '<circle cx="39" cy="28" r="2.3" fill="#0a2540"/><circle cx="51" cy="28" r="2.3" fill="#0a2540"/>' +
        '<path d="M39 35 q6 5 12 0" fill="none" stroke="#0a2540" stroke-width="2" stroke-linecap="round"/></svg>';
    }
    function tower() {
      return '<svg class="lego-tower" viewBox="0 0 170 168" aria-hidden="true">' +
        '<g ' + OL + '><rect x="30" y="118" width="120" height="42" rx="6" fill="#0A4E96"/>' +
        '<rect x="44" y="80" width="92" height="40" rx="6" fill="#0F6FD0"/>' +
        '<rect x="58" y="42" width="64" height="40" rx="6" fill="#2480D8"/></g>' +
        '<g stroke="#0a2540" stroke-width="1.8">' +
        '<g fill="#2f7fd6"><ellipse cx="58" cy="118" rx="10" ry="5"/><ellipse cx="90" cy="118" rx="10" ry="5"/><ellipse cx="122" cy="118" rx="10" ry="5"/></g>' +
        '<g fill="#3f8fe0"><ellipse cx="66" cy="80" rx="10" ry="5"/><ellipse cx="114" cy="80" rx="10" ry="5"/></g>' +
        '<g fill="#5aa3ea"><ellipse cx="78" cy="42" rx="10" ry="5"/><ellipse cx="102" cy="42" rx="10" ry="5"/></g></g>' +
        '<text x="90" y="106" text-anchor="middle" fill="#fff" font-size="13" font-weight="800" font-family="Inter,sans-serif">DATA</text>' +
        '<line x1="90" y1="42" x2="90" y2="20" stroke="#0a2540" stroke-width="3"/>' +
        '<path d="M90 20 L120 26 L90 36 Z" fill="#3F8C6E" stroke="#0a2540" stroke-width="2.2" stroke-linejoin="round"/></svg>';
    }
    var GLYPH = {
      chart: '<g fill="#fff"><rect x="14" y="34" width="6" height="9"/><rect x="26" y="28" width="6" height="15"/><rect x="38" y="22" width="6" height="21"/></g>',
      shield: '<path d="M30 18 l13 5 v9 c0 9 -7 14 -13 17 c-6 -3 -13 -8 -13 -17 v-9 z" fill="#fff"/>',
      network: '<g fill="#fff" stroke="#fff" stroke-width="2"><circle cx="18" cy="34" r="3.5"/><circle cx="42" cy="26" r="3.5"/><circle cx="42" cy="42" r="3.5"/><path d="M21 33 L39 27 M21 35 L39 41"/></g>',
      check: '<path d="M15 33 l8 8 L45 21" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>',
      globe: '<g fill="none" stroke="#fff" stroke-width="2.4"><circle cx="30" cy="33" r="12"/><path d="M18 33 H42 M30 21 v24 M22 26 q8 7 16 0 M22 40 q8 -7 16 0"/></g>'
    };
    function tile(g, c) {
      c = c || '#0063C3';
      return '<svg class="lego-tile" viewBox="0 0 60 54" aria-hidden="true">' +
        '<rect x="4" y="10" width="52" height="40" rx="7" fill="' + c + '" ' + OL + '/>' +
        '<g fill="' + c + '" stroke="#0a2540" stroke-width="1.6"><ellipse cx="18" cy="10" rx="8" ry="4"/><ellipse cx="42" cy="10" rx="8" ry="4"/></g>' +
        (GLYPH[g] || '') + '</svg>';
    }
    function stack() { return '<div class="lego-tiles">' + [].slice.call(arguments).join('') + '</div>'; }
    var B = '#0F6FD0', BL = '#0A3A6B', G = '#3F8C6E', GL = '#2A6B54', T = '#2480D8';
    var P = {
      home: [tower(), fig(B, BL), fig(G, GL), stack(tile('chart', '#0063C3'), tile('network', '#2589A0'))],
      about: [tower(), fig(B, BL)],
      why: [fig(B, BL), fig(G, GL), stack(tile('check', G))],
      methods: [fig(B, BL), stack(tile('chart', '#0063C3'), tile('check', '#2589A0'))],
      databases: [tower(), fig(B, BL), stack(tile('globe', '#2589A0'))],
      visualization: [fig(B, BL), stack(tile('chart', '#0063C3'), tile('network', G))],
      mission: [fig(B, BL), stack(tile('check', G), tile('chart', '#0063C3'))],
      projects: [tower(), fig(G, GL)],
      network: [fig(B, BL), fig(G, GL), fig(T, BL)],
      resources: [fig(B, BL), stack(tile('check', G), tile('shield', '#2589A0'))],
      news: [fig(B, BL), stack(tile('globe', '#0063C3'))],
      faq: [fig(G, GL), stack(tile('check', '#2589A0'))],
      join: [fig(B, BL), fig(G, GL), stack(tile('network', '#2589A0'))],
      contact: [fig(B, BL), stack(tile('globe', '#0063C3'))],
      "404": [fig(B, BL)]
    };
    var hero = document.querySelector(".hero") || document.querySelector(".page-hero");
    if (!hero) return;
    var parts = P[document.body.getAttribute("data-page")] || [tower(), fig(B, BL)];
    var scene = document.createElement("div");
    scene.className = "lego-scene"; scene.setAttribute("aria-hidden", "true");
    scene.innerHTML = parts.join("");
    hero.appendChild(scene);
  })();

  /* ---------- footer year ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
