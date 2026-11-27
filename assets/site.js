/* Backyard Press Club — shared page behaviour.
   Reads window.BPC_WORKS and window.BPC_INKS from works.js. */
(function () {
  'use strict';

  var WORKS = window.BPC_WORKS || [];
  var INKS = window.BPC_INKS || {};

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function hex(name) { return INKS[name] || '#3d3b38'; }
  function slug(no) { return String(no).toLowerCase().replace(/[^a-z0-9]+/g, '-'); }
  function store(key, val) {
    try {
      if (val === undefined) return window.localStorage.getItem(key);
      window.localStorage.setItem(key, val);
    } catch (e) { return null; }
  }

  /* Until a photo exists, each work is shown as a two-ink sketch.
     The layout varies by catalogue position so the grid doesn't repeat. */
  var LAYOUTS = [
    ['left:9%;top:9%;width:58%;height:62%', 'right:9%;bottom:9%;width:56%;height:52%;border-radius:50%'],
    ['left:10%;top:16%;width:58%;aspect-ratio:1;border-radius:50%', 'right:10%;top:34%;width:58%;aspect-ratio:1;border-radius:50%'],
    ['left:9%;top:10%;right:9%;height:38%', 'left:9%;bottom:10%;right:9%;height:52%;clip-path:polygon(0 100%,50% 0,100% 100%)'],
    ['left:12%;top:9%;width:34%;bottom:9%', 'right:12%;top:20%;width:52%;height:60%;border-radius:999px 999px 0 0']
  ];

  function sheet(w, i, opts) {
    opts = opts || {};
    var inner = '';
    if (w.image) {
      inner += '<img src="' + esc(w.image) + '" alt="" loading="lazy">';
    } else {
      var L = LAYOUTS[i % LAYOUTS.length];
      inner += '<span class="shape s1" style="' + L[0] + ';background:' + hex(w.inks[0]) + '"></span>';
      if (w.inks[1]) inner += '<span class="shape s2" style="' + L[1] + ';background:' + hex(w.inks[1]) + '"></span>';
    }
    inner += '<span class="grain"></span>';
    return '<span class="sheet" aria-hidden="true">' + inner + '</span>';
  }

  function inksText(w) { return w.inks.length ? w.inks.join(', ') : '[Inks]'; }

  // A real photo of the print, shown whole. On hover it lifts slightly off the mat.
  function photo(w) {
    return '<span class="photo" aria-hidden="true"><img src="' + esc(w.image) + '" alt="" loading="lazy"></span>';
  }
  function picture(w, i, opts) { return w.image ? photo(w, opts) : sheet(w, i, opts); }

  function dots(w) {
    return '<span class="dots" aria-hidden="true">' + w.inks.map(function (n) {
      return '<i style="background:' + hex(n) + '"></i>';
    }).join('') + '</span>';
  }

  function statusLabel(w) {
    if (w.status === 'sold-out') return '<span class="status">Sold out</span>';
    if (w.status === 'few-left') return '<span class="status few">Few left</span>';
    return '';
  }

  /* ---------- Quick look ---------- */
  var dialog = null;
  function ensureDialog() {
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.className = 'quick';
    dialog.setAttribute('aria-labelledby', 'ql-title');
    document.body.appendChild(dialog);
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) dialog.close();           // click on the backdrop
      if (e.target.closest('[data-close]')) dialog.close();
    });
    dialog.addEventListener('close', function () {
      if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    });
    return dialog;
  }

  function openQuick(idx) {
    var w = WORKS[idx];
    if (!w) return;
    var d = ensureDialog();
    var sold = w.status === 'sold-out';
    var buy;
    if (sold) {
      buy = '<span class="btn" aria-disabled="true">Sold out</span>' +
            '<span class="mono mute">Stays in the catalogue as part of the record.</span>';
    } else if (w.buy) {
      buy = '<a class="btn" href="' + esc(w.buy) + '" rel="noopener">Buy · ' + esc(w.price) + '</a>' +
            '<span class="mono mute">Secure checkout with Stripe. Choose quantity on the next page.</span>';
    } else {
      buy = '<span class="btn" aria-disabled="true">Buy · ' + esc(w.price) + '</span>' +
            '<span class="mono mute">[Checkout link coming soon]</span>';
    }
    var size = esc(w.size) + (w.pages ? ' · ' + esc(w.pages) : '');
    d.innerHTML =
      '<div class="ql">' +
        '<div class="pic' + (w.image ? ' has-photo' : '') + '">' + picture(w, idx, { noDetail: true }) + '</div>' +
        '<div class="body">' +
          '<div class="top"><span class="mono mute">' + esc(w.no) + ' · ' + esc(w.type) + '</span>' +
          '<button type="button" class="close" data-close>Close</button></div>' +
          '<h2 class="display" id="ql-title">' + esc(w.title) + ' <span class="by">by ' + esc(w.artist) + '</span></h2>' +
          '<p>' + esc(w.about) + '</p>' +
          '<dl>' +
            '<dt>Inks</dt><dd>' + (w.inks.length ? w.inks.map(function (n) {
              return '<span class="ink"><i style="background:' + hex(n) + '" aria-hidden="true"></i>' + esc(n) + '</span>';
            }).join('') : '[Inks]') + '</dd>' +
            '<dt>Size</dt><dd>' + size + '</dd>' +
            '<dt>Paper</dt><dd>' + esc(w.paper) + '</dd>' +
            '<dt>Edition</dt><dd>' + esc(w.edition) + ', signed and numbered · ' + esc(w.year) + '</dd>' +
            '<dt>Price</dt><dd>' + esc(w.price) + (w.framed ? ' unframed · ' + esc(w.framed) + ' framed (pickup in Brooklyn)' : '') + '</dd>' +
          '</dl>' +
          '<div class="buy">' + buy + '<a class="more" href="' + pageUrl(w) + '">See the full page</a></div>' +
        '</div>' +
      '</div>';
    if (!d.open) d.showModal();
    history.replaceState(null, '', '#' + slug(w.no));
  }

  function bindQuick(root) {
    root.addEventListener('click', function (e) {
      var el = e.target.closest('[data-work]');
      if (el) openQuick(Number(el.getAttribute('data-work')));
    });
  }

  function openFromHash() {
    var h = location.hash.slice(1);
    if (!h || /-print$/.test(h)) return;
    for (var i = 0; i < WORKS.length; i++) if (slug(WORKS[i].no) === h) { openQuick(i); return; }
  }

  /* ---------- Shop (board C: fixed index on the left, prints scrolling on the right) ---------- */
  // The mat follows the real format, so size reads at a glance.
  function format(w) {
    var s = String(w.size).toUpperCase();
    if (/A2|A1/.test(s)) return 'large';
    if (/A4/.test(s)) return 'landscape';
    if (/A5|A6/.test(s)) return 'small';
    return 'tall';
  }

  function shop(root) {
    var index = root.querySelector('[data-index]');
    var prints = root.querySelector('[data-prints]');
    // Newest first, with sold-out works moved to the end so the shop opens on something you can buy.
    var all = WORKS.map(function (w, i) { return i; }).reverse();
    var order = all.filter(function (i) { return WORKS[i].status !== 'sold-out'; })
      .concat(all.filter(function (i) { return WORKS[i].status === 'sold-out'; }));

    index.insertAdjacentHTML('beforeend', order.map(function (i) {
      var w = WORKS[i], sold = w.status === 'sold-out';
      return '<a role="listitem" class="index-row' + (sold ? ' is-sold' : '') + '" href="#' + slug(w.no) + '-print" data-jump="' + i + '">' +
        '<span class="no">' + esc(w.no) + '</span>' +
        '<span class="t">' + esc(w.title) + ', <span>' + esc(w.colorway || w.artist) + '</span></span>' +
        '<span class="p">' + (sold ? 'Sold out' : esc(w.price)) + '</span></a>';
    }).join(''));

    prints.innerHTML = order.map(function (i) {
      var w = WORKS[i], sold = w.status === 'sold-out';
      return '<button type="button" class="plate ' + (w.image ? 'has-photo' : 'fmt-' + format(w)) + (sold ? ' is-sold' : '') + '" id="' + slug(w.no) + '-print" data-work="' + i + '" aria-label="' + esc(w.no + ', ' + w.title + ' by ' + w.artist + (sold ? ', sold out' : ', ' + w.price)) + '">' +
        picture(w, i) +
        '<span class="cap"><span>' + esc(w.no) + ' · ' + esc(w.title) + ', ' + esc(w.artist) + (sold ? ' · Sold out' : '') + '</span>' +
        '<span>' + esc(inksText(w)) + ' · ' + esc(w.size) + '</span></span>' +
      '</button>';
    }).join('');

    // Index rows scroll the right column to their print instead of jumping the page.
    index.addEventListener('click', function (e) {
      var a = e.target.closest('[data-jump]');
      if (!a) return;
      e.preventDefault();
      var el = document.getElementById(slug(WORKS[a.getAttribute('data-jump')].no) + '-print');
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (el) { el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); el.focus({ preventScroll: true }); }
    });

    // Mark the index row for the print in view.
    if ('IntersectionObserver' in window) {
      var rows = {};
      index.querySelectorAll('[data-jump]').forEach(function (r) { rows[r.getAttribute('data-jump')] = r; });
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          Object.keys(rows).forEach(function (k) { rows[k].classList.remove('is-current'); rows[k].removeAttribute('aria-current'); });
          var r = rows[en.target.getAttribute('data-work')];
          if (r) { r.classList.add('is-current'); r.setAttribute('aria-current', 'true'); }
        });
      }, { rootMargin: '-45% 0px -45% 0px' });
      prints.querySelectorAll('.plate').forEach(function (p) { io.observe(p); });
    }

    bindQuick(prints);
  }

  /* ---------- Catalogue ---------- */
  function catalogue(root) {
    var out = root.querySelector('[data-catalogue]');
    var count = root.querySelector('[data-count]');
    var toggles = root.querySelectorAll('[data-view]');
    var view = store('bpc-view') === 'grid' ? 'grid' : 'list';
    if (count) count.textContent = WORKS.length + (WORKS.length === 1 ? ' work' : ' works');

    function draw() {
      toggles.forEach(function (t) { t.setAttribute('aria-pressed', String(t.getAttribute('data-view') === view)); });
      if (view === 'list') {
        out.innerHTML =
          '<div class="cat-scroll"><div class="cat-list" role="table" aria-label="All works">' +
            '<div class="cat-row head" role="row"><span role="columnheader">No.</span><span role="columnheader"><span class="skip">Picture</span></span><span role="columnheader">Title</span><span role="columnheader">Artist</span><span role="columnheader">Format</span><span role="columnheader" class="num">Year</span></div>' +
            WORKS.map(function (w, i) {
              return '<button type="button" class="cat-row" role="row" data-work="' + i + '">' +
                '<span class="mono mute" role="cell">' + esc(w.no) + '</span>' +
                '<span class="thumb" role="cell">' + sheet(w, i, { noDetail: true }) + '</span>' +
                '<span class="display t" role="cell">' + esc(w.title) + (w.colorway ? ' <span class="mute" style="font-weight:400">' + esc(w.colorway) + '</span>' : '') + (w.status === 'sold-out' ? ' <span class="status">Sold out</span>' : '') + '</span>' +
                '<span role="cell">' + esc(w.artist) + '</span>' +
                '<span role="cell" style="color:#333">' + esc(w.type) + '</span>' +
                '<span role="cell" class="num">' + esc(w.year) + '</span>' +
              '</button>';
            }).join('') +
          '</div></div>';
      } else {
        out.innerHTML = '<div class="cat-grid">' + WORKS.map(function (w, i) {
          return '<button type="button" class="work' + (w.status === 'sold-out' ? ' is-sold' : '') + '" data-work="' + i + '">' +
            '<span class="mat' + (w.image ? ' has-photo' : '') + '">' + picture(w, i) + '</span>' +
            '<span class="meta"><span class="mono mute">' + esc(w.no) + ' · ' + esc(w.type) + '</span>' +
            '<span class="display">' + esc(w.title) + '</span>' + statusLabel(w) + '</span>' +
          '</button>';
        }).join('') + '</div>';
      }
    }
    toggles.forEach(function (t) {
      t.addEventListener('click', function () { view = t.getAttribute('data-view'); store('bpc-view', view); draw(); });
    });
    draw();
    out.addEventListener('click', function (e) {
      var el = e.target.closest('[data-work]');
      if (el) location.href = pageUrl(WORKS[Number(el.getAttribute('data-work'))]);
    });
  }

  /* ---------- Ink picker (Riso printing page) ---------- */
  function inkPicker(root) {
    var chips = root.querySelector('[data-chips]');
    var s1 = root.querySelector('[data-op1]');
    var s2 = root.querySelector('[data-op2]');
    var cap = root.querySelector('[data-op-caption]');
    var names = (window.BPC_DRUMS || Object.keys(INKS)).filter(function (n) { return INKS[n]; });
    var picked = [0, 1];                       // first ink down, then the ink printed over it

    function draw() {
      chips.innerHTML = names.map(function (n, i) {
        return '<button type="button" class="chip" aria-pressed="' + (picked.indexOf(i) !== -1) + '" data-i="' + i + '">' +
          '<span class="dot" style="background:' + INKS[n] + '" aria-hidden="true"></span>' +
          '<span>' + esc(n) + '</span></button>';
      }).join('');
      s1.style.background = INKS[names[picked[0]]];
      s2.style.background = INKS[names[picked[1]]];
      cap.textContent = names[picked[1]] + ' over ' + names[picked[0]];
    }
    chips.addEventListener('click', function (e) {
      var b = e.target.closest('[data-i]');
      if (!b) return;
      var i = Number(b.getAttribute('data-i'));
      if (picked.indexOf(i) !== -1) return;
      picked = [picked[1], i];
      draw();
      var again = chips.querySelector('[data-i="' + i + '"]');
      if (again) again.focus();
    });
    draw();
  }


  /* ---------- One print's page (print.html?no=bpc-002) ---------- */
  function pageUrl(w) { return 'print.html?no=' + slug(w.no); }

  function printPage(root) {
    var want = (new URLSearchParams(location.search).get('no') || '').toLowerCase();
    var idx = -1;
    for (var i = 0; i < WORKS.length; i++) if (slug(WORKS[i].no) === want) idx = i;
    if (idx === -1) { root.querySelector('[data-missing]').hidden = false; return; }
    var w = WORKS[idx], sold = w.status === 'sold-out';
    document.title = w.title + (w.colorway ? ', ' + w.colorway : '') + ' · Backyard Press Club';

    var views = [{ key: 'print', label: 'Print' }];
    if (w.photo) views.push({ key: 'photo', label: 'Photo' });
    if (w.layers && w.layers.length === w.inks.length && w.layers.length) views.push({ key: 'inks', label: 'Ink by ink' });

    var siblings = WORKS.map(function (x, j) { return j; }).filter(function (j) { return j !== idx && WORKS[j].title === w.title && WORKS[j].colorway; });
    var prev = WORKS[idx - 1], next = WORKS[idx + 1];

    var buy;
    if (sold) buy = '<span class="btn" aria-disabled="true">Sold out</span>';
    else if (w.buy) buy = '<a class="btn" href="' + esc(w.buy) + '" rel="noopener">Buy · ' + esc(w.price) + '</a>';
    else buy = '<span class="btn" aria-disabled="true">Buy · ' + esc(w.price) + '</span><span class="mono mute">[Checkout link coming soon]</span>';

    var inkList = w.inks.length ? w.inks.map(function (n) {
      return '<span class="ink"><i style="background:' + hex(n) + '" aria-hidden="true"></i>' + esc(n) + '</span>';
    }).join('') : '[Inks]';

    // The ink-by-ink stack: a blank sheet, then each ink printed over the last.
    var layers = '';
    if (w.layers) {
      layers = '<div class="pp-layers" data-layers style="--paper-tone:#f2ebd0">' +
        '<img class="sizer" src="' + esc(w.image) + '" alt="">' +
        w.layers.map(function (src, k) { return '<img class="layer" data-layer="' + k + '" src="' + esc(src) + '" alt="">'; }).join('') +
      '</div>';
    }
    var steps = w.layers ? [{ label: 'Paper', cap: 'The blank sheet: ' + w.paper + '.' }].concat(w.inks.map(function (n, k) {
      return { label: n, ink: n, cap: k === 0 ? 'Pass 1 of ' + w.inks.length + ': ' + n + ' goes down first.'
        : 'Pass ' + (k + 1) + ' of ' + w.inks.length + ': ' + n + ' is printed over it. Where the inks overlap, they mix.' };
    })) : [];

    root.innerHTML =
      '<nav class="crumbs mono" aria-label="Breadcrumb"><a href="catalogue.html">Catalogue</a><span aria-hidden="true"> / </span><span aria-current="page">' + esc(w.no) + '</span></nav>' +
      '<div class="pp">' +
        '<div class="pp-fig">' +
          '<div class="pp-stage" data-stage>' +
            '<div class="pp-view" data-v="print"><span class="pp-img"><img src="' + esc(w.image) + '" alt="' + esc(w.title + (w.colorway ? ', ' + w.colorway : '') + ', scan of the print') + '"></span></div>' +
            (w.photo ? '<div class="pp-view" data-v="photo" hidden><span class="pp-img"><img src="' + esc(w.photo) + '" alt="' + esc(w.title + ', photographed') + '" loading="lazy"></span></div>' : '') +
            (layers ? '<div class="pp-view" data-v="inks" hidden>' + layers + '</div>' : '') +
          '</div>' +
          (views.length > 1 ? '<div class="pp-under">' +
            '<div class="tabs" role="group" aria-label="View">' + views.map(function (v, k) {
              return '<button type="button" class="tab" data-view="' + v.key + '" aria-pressed="' + (k === 0) + '">' + v.label + '</button>';
            }).join('') + '</div>' +
            (steps.length ? '<div class="pp-steps" data-steps hidden>' +
              '<div class="steps-row">' + steps.map(function (st, k) {
                return '<button type="button" class="step" data-step="' + k + '" aria-pressed="' + (k === steps.length - 1) + '">' +
                  '<span class="n">' + k + '</span>' + (st.ink ? '<i style="background:' + hex(st.ink) + '" aria-hidden="true"></i>' : '') + esc(st.label) + '</button>';
              }).join('') + '<button type="button" class="play" data-play>Play</button></div>' +
              '<p class="mono mute" data-step-cap aria-live="polite"></p>' +
            '</div>' : '') +
          '</div>' : '') +
        '</div>' +
        '<div class="pp-text">' +
          '<span class="mono mute">' + esc(w.no) + ' · ' + esc(w.type) + '</span>' +
          '<h1 class="display">' + esc(w.title) + '</h1>' +
          '<p class="by">' + esc(w.artist) + (w.colorway ? '<br><span class="mute">' + esc(w.colorway) + '</span>' : '') + '</p>' +
          '<p class="about">' + esc(w.about) + '</p>' +
          '<dl class="facts">' +
            '<dt>Inks</dt><dd class="inklist">' + inkList + '</dd>' +
            '<dt>Size</dt><dd>' + esc(w.size) + (w.pages ? ' · ' + esc(w.pages) : '') + '</dd>' +
            '<dt>Paper</dt><dd>' + esc(w.paper) + '</dd>' +
            '<dt>Edition</dt><dd>' + esc(w.edition) + ', signed and numbered</dd>' +
            '<dt>Year</dt><dd>' + esc(w.year) + '</dd>' +
            '<dt>Price</dt><dd>' + esc(w.price) + (w.framed ? ' unframed · ' + esc(w.framed) + ' framed (pickup in Brooklyn)' : '') + '</dd>' +
          '</dl>' +
          '<div class="pp-buy">' + buy + '</div>' +
          (siblings.length ? '<div class="pp-sibs"><span class="mono mute">Also in this edition</span>' + siblings.map(function (j) {
            var x = WORKS[j];
            return '<a class="sib" href="' + pageUrl(x) + '"><span class="sib-img"><img src="' + esc(x.image) + '" alt="" loading="lazy"></span>' +
              '<span><span class="display">' + esc(x.colorway) + '</span><br><span class="mono mute">' + esc(x.no) + '</span></span></a>';
          }).join('') + '</div>' : '') +
        '</div>' +
      '</div>' +
      '<nav class="pp-pager" aria-label="More prints">' +
        (prev ? '<a href="' + pageUrl(prev) + '"><span class="mono mute">Previous · ' + esc(prev.no) + '</span><span class="display">' + esc(prev.title) + '</span></a>' : '<span></span>') +
        (next ? '<a class="nx" href="' + pageUrl(next) + '"><span class="mono mute">Next · ' + esc(next.no) + '</span><span class="display">' + esc(next.title) + '</span></a>' : '<span></span>') +
      '</nav>';

    // Views
    var stepsBox = root.querySelector('[data-steps]');
    root.querySelectorAll('[data-view]').forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.getAttribute('data-view');
        root.querySelectorAll('[data-view]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        root.querySelectorAll('.pp-view').forEach(function (x) { x.hidden = x.getAttribute('data-v') !== v; });
        if (stepsBox) stepsBox.hidden = v !== 'inks';
        if (v === 'inks') show(0, true);
      });
    });

    // Ink by ink
    if (!steps.length) return;
    var cap = root.querySelector('[data-step-cap]');
    var layerEls = root.querySelectorAll('[data-layer]');
    var stepEls = root.querySelectorAll('[data-step]');
    var timer = null;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function show(k, autoplay) {
      layerEls.forEach(function (l) { l.classList.toggle('on', Number(l.getAttribute('data-layer')) < k); });
      stepEls.forEach(function (b) { b.setAttribute('aria-pressed', String(Number(b.getAttribute('data-step')) === k)); });
      cap.textContent = steps[k].cap;
      if (autoplay && !reduce) play();
    }
    function play() {
      clearInterval(timer);
      var k = 0; show(0);
      timer = setInterval(function () {
        k += 1; show(k);
        if (k >= steps.length - 1) clearInterval(timer);
      }, 1400);
    }
    stepEls.forEach(function (b) {
      b.addEventListener('click', function () { clearInterval(timer); show(Number(b.getAttribute('data-step'))); });
    });
    root.querySelector('[data-play]').addEventListener('click', play);
    show(steps.length - 1);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var page = document.body.getAttribute('data-page');
    if (page === 'shop') shop(document);
    if (page === 'catalogue') catalogue(document);
    if (page === 'printing') inkPicker(document);
    if (page === 'print') printPage(document.querySelector('[data-print]'));
    if (page === 'shop' || page === 'catalogue') {
      openFromHash();
      window.addEventListener('hashchange', openFromHash);
    }
    var y = document.querySelector('[data-year]');
    if (y) y.textContent = new Date().getFullYear();
  });
})();
