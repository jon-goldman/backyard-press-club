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
      if (w.detail && !opts.noDetail) inner += '<img class="detail" src="' + esc(w.detail) + '" alt="" loading="lazy">';
    } else {
      var L = LAYOUTS[i % LAYOUTS.length];
      inner += '<span class="shape s1" style="' + L[0] + ';background:' + hex(w.inks[0]) + '"></span>';
      if (w.inks[1]) inner += '<span class="shape s2" style="' + L[1] + ';background:' + hex(w.inks[1]) + '"></span>';
    }
    inner += '<span class="grain"></span>';
    return '<span class="sheet" aria-hidden="true">' + inner + '</span>';
  }

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
        '<div class="pic">' + sheet(w, idx, { noDetail: true }) + '</div>' +
        '<div class="body">' +
          '<div class="top"><span class="mono mute">' + esc(w.no) + ' · ' + esc(w.type) + '</span>' +
          '<button type="button" class="close" data-close>Close</button></div>' +
          '<h2 class="display" id="ql-title">' + esc(w.title) + ' <span class="by">by ' + esc(w.artist) + '</span></h2>' +
          '<p>' + esc(w.about) + '</p>' +
          '<dl>' +
            '<dt>Inks</dt><dd>' + w.inks.map(function (n) {
              return '<span class="ink"><i style="background:' + hex(n) + '" aria-hidden="true"></i>' + esc(n) + '</span>';
            }).join('') + '</dd>' +
            '<dt>Size</dt><dd>' + size + '</dd>' +
            '<dt>Paper</dt><dd>' + esc(w.paper) + '</dd>' +
            '<dt>Edition</dt><dd>' + esc(w.edition) + ' copies · ' + esc(w.year) + '</dd>' +
          '</dl>' +
          '<div class="buy">' + buy + '</div>' +
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
    if (!h) return;
    for (var i = 0; i < WORKS.length; i++) if (slug(WORKS[i].no) === h) { openQuick(i); return; }
  }

  /* ---------- Shop ---------- */
  function shop(root) {
    var grid = root.querySelector('[data-grid]');
    var tabs = root.querySelectorAll('[data-filter]');
    var current = 'All';
    var plural = { Print: 'Prints', Zine: 'Zines', Poster: 'Posters', Book: 'Books' };

    function draw() {
      var html = '';
      WORKS.forEach(function (w, i) {
        if (w.status === 'sold-out') return;               // the shop only shows what can be bought
        if (current !== 'All' && plural[w.type] !== current) return;
        html +=
          '<button type="button" class="work" data-work="' + i + '" aria-label="' + esc(w.title + ' by ' + w.artist + ', ' + w.price) + '">' +
            '<span class="mat">' + sheet(w, i) + '</span>' +
            '<span class="line1"><span class="display">' + esc(w.title) + '</span><span class="price">' + esc(w.price) + '</span></span>' +
            '<span class="line2"><span>' + esc(w.artist) + '</span><span aria-hidden="true">·</span>' + dots(w) +
            '<span class="mono">' + esc(w.inks.join(' + ')) + ' · ' + esc(w.size) + '</span>' + statusLabel(w) + '</span>' +
          '</button>';
      });
      grid.innerHTML = html || '<p class="empty">Nothing in this section right now. See the <a href="catalogue.html">catalogue</a> for past editions.</p>';
    }
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        current = t.getAttribute('data-filter');
        tabs.forEach(function (o) { o.setAttribute('aria-pressed', String(o === t)); });
        draw();
      });
    });
    draw();
    bindQuick(grid);
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
                '<span class="display t" role="cell">' + esc(w.title) + (w.status === 'sold-out' ? ' <span class="status">Sold out</span>' : '') + '</span>' +
                '<span role="cell">' + esc(w.artist) + '</span>' +
                '<span role="cell" style="color:#333">' + esc(w.type) + '</span>' +
                '<span role="cell" class="num">' + esc(w.year) + '</span>' +
              '</button>';
            }).join('') +
          '</div></div>';
      } else {
        out.innerHTML = '<div class="cat-grid">' + WORKS.map(function (w, i) {
          return '<button type="button" class="work' + (w.status === 'sold-out' ? ' is-sold' : '') + '" data-work="' + i + '">' +
            '<span class="mat">' + sheet(w, i) + '</span>' +
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
    bindQuick(out);
  }

  /* ---------- Ink picker (Riso printing page) ---------- */
  function inkPicker(root) {
    var chips = root.querySelector('[data-chips]');
    var s1 = root.querySelector('[data-op1]');
    var s2 = root.querySelector('[data-op2]');
    var cap = root.querySelector('[data-op-caption]');
    var names = Object.keys(INKS);
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

  document.addEventListener('DOMContentLoaded', function () {
    var page = document.body.getAttribute('data-page');
    if (page === 'shop') shop(document);
    if (page === 'catalogue') catalogue(document);
    if (page === 'printing') inkPicker(document);
    if (page === 'shop' || page === 'catalogue') {
      openFromHash();
      window.addEventListener('hashchange', openFromHash);
    }
    var y = document.querySelector('[data-year]');
    if (y) y.textContent = new Date().getFullYear();
  });
})();
