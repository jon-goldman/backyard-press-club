/* Backyard Press Club — shared page behaviour.
   Reads window.BPC_WORKS and window.BPC_INKS from works.js. */
(function () {
  'use strict';

  var WORKS = window.BPC_WORKS || [];
  // Versions of one image (same title) are told apart by their inks, e.g. "Kelly Green and Teal".
  WORKS.forEach(function (w) {
    var same = WORKS.filter(function (x) { return x.title === w.title; }).length > 1;
    if (!w.colorway && same && w.inks.length) w.colorway = w.inks.join(' and ');
  });
  var INKS = window.BPC_INKS || {};

  function editionText(w) {
    return w.edition ? esc(w.edition) + ', signed and numbered' : 'Open run, unsigned';
  }
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
     The layout varies by catalog position so the grid doesn't repeat. */
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

  // Sold out is set by hand in works.js (status: "sold-out"); there are no stock counts.
  function isSold(w) { return w.status === 'sold-out'; }
  function statusLabel(w) {
    if (isSold(w)) return '<span class="status">Sold out</span>';
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

  // Formats (Nov 28, Jon approved): one page per artwork, with a picker when it comes in more
  // than one format (Print, Postcard, Framed). Each format has its own Stripe Payment Link.
  //   w.buy / w.price / w.size   the work's own format (its type: Print or Postcard)
  //   w.framed / w.buyFramed     framed, pickup in Brooklyn
  //   w.alsoAs                   more formats, e.g. [{ label: 'Postcard', size: '4 × 6 in', price: '$8', buy: '' }]
  function formatsOf(w) {
    var out = [{ label: w.type, size: w.size, price: w.price, buy: w.buy, ship: true }];
    (w.alsoAs || []).forEach(function (f) { out.push({ label: f.label, size: f.size, price: f.price, buy: f.buy, ship: true }); });
    out.forEach(function (f) { f.freeShip = f.label === 'Postcard'; });   // postcard links charge no shipping
    if (w.framed) out.push({ label: 'Framed', size: 'Pickup in Brooklyn', price: w.framed, buy: w.buyFramed, ship: false });
    return out;
  }
  function hasPostcard(w) { return formatsOf(w).some(function (f) { return f.label === 'Postcard'; }); }
  function pricesText(w) {
    var f = formatsOf(w);
    if (f.length === 1) return esc(f[0].price);
    return f.map(function (x) { return esc(x.label) + ' ' + esc(x.price); }).join(' · ');
  }
  function buyNote(f) {
    if (!f.buy) return 'Checkout opens soon.';
    return (!f.ship ? 'Pickup in Brooklyn.' : f.freeShip ? 'Free US shipping.' : '$8 flat shipping in the US.') + ' Checkout by Stripe.';
  }
  function buyButton(f) {
    return f.buy
      ? '<a class="btn" data-buy href="' + esc(f.buy) + '" rel="noopener">Buy · ' + esc(f.price) + '</a>'
      : '<span class="btn" data-buy aria-disabled="true">Buy · ' + esc(f.price) + '</span>';
  }
  // What the buy box offers: the work's formats, then the set it belongs to (if any),
  // so a postcard's page can sell the card or the whole set from one picker.
  function setOf(w) { return (window.BPC_SETS || []).filter(function (x) { return x.items.indexOf(w.no) !== -1; })[0]; }
  function optionsOf(w) {
    var out = formatsOf(w), set = setOf(w);
    if (set) out.push({ label: set.title, size: 'All ' + set.items.length + ', one of each', price: set.price, buy: set.buy, ship: true, freeShip: true });
    return out;
  }
  function buyButtons(w, sold, soldNote) {
    if (sold) return '<span class="btn" aria-disabled="true">Sold out</span>' + (soldNote ? '<span class="mono mute">' + esc(soldNote) + '</span>' : '');
    var fs = optionsOf(w);
    var picker = fs.length > 1
      ? '<fieldset class="fmt"><legend class="mono mute">Format</legend>' + fs.map(function (f, k) {
          return '<label class="fmt-opt"><input type="radio" name="fmt-' + slug(w.no) + '" value="' + k + '"' + (k === 0 ? ' checked' : '') + '>' +
            '<span><strong>' + esc(f.label) + '</strong> <span class="mute">' + esc(f.size) + '</span></span><span class="fmt-p">' + esc(f.price) + '</span></label>';
        }).join('') + '</fieldset>'
      : '';
    return '<div class="fmt-box" data-fmt-box="' + WORKS.indexOf(w) + '">' + picker + buyButton(fs[0]) +
      '<span class="mono mute" data-buy-note>' + buyNote(fs[0]) + '</span>' +
    '</div>';
  }
  document.addEventListener('change', function (e) {
    var r = e.target.closest('.fmt input[type="radio"]');
    if (!r) return;
    var box = r.closest('[data-fmt-box]');
    var f = optionsOf(WORKS[Number(box.getAttribute('data-fmt-box'))])[Number(r.value)];
    box.querySelector('[data-buy]').outerHTML = buyButton(f);
    box.querySelector('[data-buy-note]').textContent = buyNote(f);
  });

  function openQuick(idx) {
    var w = WORKS[idx];
    if (!w) return;
    var d = ensureDialog();
    var sold = isSold(w);
    var buy = buyButtons(w, sold, '');
    var size = esc(w.size) + (w.pages ? ' · ' + esc(w.pages) : '');
    d.innerHTML =
      '<div class="ql">' +
        '<div class="pic' + (w.image ? ' has-photo' : '') + '">' + picture(w, idx, { noDetail: true }) + '</div>' +
        '<div class="body">' +
          '<div class="top"><span class="mono mute">' + esc(w.no) + ' · ' + esc(w.type) + '</span>' +
          '<button type="button" class="close" data-close>Close</button></div>' +
          '<h2 class="display" id="ql-title">' + esc(w.title) + (w.colorway ? ' <span class="by">' + esc(w.colorway) + '</span>' : '') + '</h2>' +
          '<p>' + esc(w.about) + '</p>' +
          '<dl>' +
            '<dt>Inks</dt><dd>' + (w.inks.length ? w.inks.map(function (n) {
              return '<span class="ink"><i style="background:' + hex(n) + '" aria-hidden="true"></i>' + esc(n) + '</span>';
            }).join('') : '[Inks]') + '</dd>' +
            '<dt>Size</dt><dd>' + size + '</dd>' +
            '<dt>Paper</dt><dd>' + esc(w.paper) + '</dd>' +
            '<dt>Edition</dt><dd>' + editionText(w) + ' · ' + esc(w.year) + '</dd>' +
            (formatsOf(w).length > 1 ? '' : '<dt>Price</dt><dd>' + pricesText(w) + '</dd>') +
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

  // Long side of the paper over 17 in (the largest sheet), for drawing prints to scale.
  function scaleOf(w) {
    var m = String(w.size).match(/([\d.]+)\s*[×x]\s*([\d.]+)\s*in/);
    if (!m) return 1;
    // Softened so a postcard still reads as a picture: 4 × 6 in draws at about 0.55, 11 × 17 at 1.
    var r = Math.min(1, Math.max(+m[1], +m[2]) / 17);
    return (.3 + .7 * r).toFixed(2);
  }

  function shop(root) {
    var index = root.querySelector('[data-index]');
    var prints = root.querySelector('[data-prints]');
    // Newest first, with sold-out works moved to the end so the shop opens on something you can buy.
    var all = WORKS.map(function (w, i) { return i; }).reverse();
    var order = all.filter(function (i) { return !isSold(WORKS[i]); })
      .concat(all.filter(function (i) { return isSold(WORKS[i]); }));

    index.insertAdjacentHTML('beforeend', order.map(function (i) {
      var w = WORKS[i], sold = isSold(w);
      return '<a role="listitem" class="index-row' + (sold ? ' is-sold' : '') + '" href="#' + slug(w.no) + '-print" data-jump="' + i + '">' +
        '<span class="no">' + esc(w.no) + '</span>' +
        // Design polish 3 (Nov 28): colorways show as ink dots so every row stays one line.
        '<span class="t"><span class="tt">' + esc(w.title) + '</span>' + (w.colorway ? '<span class="sr">, ' + esc(w.colorway) + '</span><span class="dots" aria-hidden="true" title="' + esc(w.colorway) + '">' + (w.inks || []).map(function (n) { return '<i style="background:' + hex(n) + '"></i>'; }).join('') + '</span>' : '') + '</span>' +
        '<span class="p">' + (sold ? 'Sold out' : esc(w.price)) + '</span></a>';
    }).join(''));

    prints.innerHTML = order.map(function (i) {
      var w = WORKS[i], sold = isSold(w);
      return '<button type="button" class="plate ' + (w.image ? 'has-photo' : 'fmt-' + format(w)) + (sold ? ' is-sold' : '') + '" style="--s:' + scaleOf(w) + '" id="' + slug(w.no) + '-print" data-work="' + i + '" aria-label="' + esc(w.no + ', ' + w.title + (w.colorway ? ', ' + w.colorway : '') + (sold ? ', sold out' : ', ' + w.price)) + '">' +
        picture(w, i) +
        '<span class="cap"><span>' + esc(w.no) + ' · ' + esc(w.title) + (!sold && hasPostcard(w) && w.type !== 'Postcard' ? ' · Also as a postcard' : '') + '</span>' +
        // Design polish 5 (Nov 28, Jon: clean and simple): the shop caption carries size and price;
        // the inks live on the print's own page.
        '<span><span class="nw">' + esc(w.size) + '</span> · ' + (sold ? 'Sold out' : esc(w.price)) + '</span></span>' +
      '</button>';
    }).join('');

    // The first print is the first thing anyone sees: load it right away (Nov 28).
    var first = prints.querySelector('.plate img');
    if (first) { first.loading = 'eager'; first.setAttribute('fetchpriority', 'high'); }

    // Sets (Nov 28): one product made of several works, sold on one Stripe link.
    (window.BPC_SETS || []).forEach(function (set) {
      var items = set.items.map(function (no) { return WORKS.filter(function (w) { return w.no === no; })[0]; }).filter(Boolean);
      prints.insertAdjacentHTML('beforeend',
        '<section class="set-plate" id="' + esc(set.id) + '" aria-label="' + esc(set.title) + '">' +
          '<div class="set-cards">' + items.map(function (w) {
            return '<a class="set-card" href="' + pageUrl(w) + '" title="' + esc(w.title) + '"><img src="' + esc(w.image) + '" alt="' + esc(w.title) + '" loading="lazy"></a>';
          }).join('') + '</div>' +
          '<div class="set-text">' +
            '<div><span class="mono mute">Set · ' + items.length + ' postcards</span><h2 class="display">' + esc(set.title) + '</h2>' +
            '<p>' + esc(set.about) + '</p></div>' +
            '<div class="set-buy">' + (set.buy
              ? '<a class="btn" href="' + esc(set.buy) + '" rel="noopener">Buy the set · ' + esc(set.price) + '</a>'
              : '<span class="btn" aria-disabled="true">Buy the set · ' + esc(set.price) + '</span>') +
            '<span class="mono mute">' + (set.buy ? 'Checkout by Stripe. Free US shipping.' : 'Checkout opens soon. Free US shipping.') + '</span></div>' +
          '</div>' +
        '</section>');
      index.insertAdjacentHTML('beforeend',
        '<a role="listitem" class="index-row" href="#' + esc(set.id) + '"><span class="no">Set</span><span class="t">' + esc(set.title) + '</span><span class="p">' + esc(set.price) + '</span></a>');
    });

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

  /* ---------- Catalog ---------- */
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
          '<div class="cat-scroll"><div class="cat-list">' +
            '<div class="cat-row head" aria-hidden="true"><span>No.</span><span></span><span>Title</span><span>Inks</span><span>Format</span><span class="num">Year</span></div>' +
            WORKS.map(function (w, i) {
              return '<a class="cat-row" href="' + pageUrl(w) + '">' +
                '<span class="mono mute">' + esc(w.no) + '</span>' +
                '<span class="thumb">' + sheet(w, i, { noDetail: true }) + '</span>' +
                '<span class="display t">' + esc(w.title) + (w.colorway ? ' <span class="mute" style="font-weight:400">' + esc(w.colorway) + '</span>' : '') + (isSold(w) ? ' <span class="status">Sold out</span>' : '') + '</span>' +
                '<span class="ci">' + (w.inks.length ? esc(w.inks.join(', ')) : '<span class="mute">[Inks]</span>') + '</span>' +
                '<span class="cf">' + esc(w.type) + '</span>' +
                '<span class="num cy">' + esc(w.year) + '</span>' +
              '</a>';
            }).join('') +
          '</div></div>';
      } else {
        out.innerHTML = '<div class="cat-grid">' + WORKS.map(function (w, i) {
          return '<a class="work' + (isSold(w) ? ' is-sold' : '') + '" href="' + pageUrl(w) + '">' +
            '<span class="mat' + (w.image ? ' has-photo' : '') + '">' + picture(w, i) + '</span>' +
            '<span class="meta"><span class="mono mute">' + esc(w.no) + ' · ' + esc(w.type) + '</span>' +
            '<span class="display">' + esc(w.title) + '</span>' + statusLabel(w) + '</span>' +
          '</a>';
        }).join('') + '</div>';
      }
    }
    toggles.forEach(function (t) {
      t.addEventListener('click', function () { view = t.getAttribute('data-view'); store('bpc-view', view); draw(); });
    });
    draw();
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
          '<span>' + esc(n) + '</span>' +
          '<span class="sr">, </span><span class="pass mono">' + (picked[0] === i ? '1st pass' : picked[1] === i ? '2nd pass' : '') + '</span></button>';
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
    var w = WORKS[idx], sold = isSold(w);
    var fullTitle = w.title + (w.colorway ? ', ' + w.colorway : '');
    document.title = fullTitle + ' · Backyard Press Club';

    var hasLayers = !!(w.layers && w.layers.length && w.layers.length === w.inks.length);
    var views = [{ key: 'print', label: 'Print' }];
    if (w.photo) views.push({ key: 'photo', label: 'Photo' });
    if (hasLayers) views.push({ key: 'layers', label: 'Layers' }, { key: 'byink', label: 'Ink by ink' });

    var ways = WORKS.map(function (x, j) { return j; }).filter(function (j) { return WORKS[j].title === w.title && WORKS[j].colorway; });
    var prev = WORKS[idx - 1], next = WORKS[idx + 1];

    var buy = buyButtons(w, sold, '');

    var inkList = w.inks.length ? w.inks.map(function (n) {
      return '<span class="ink"><i style="background:' + hex(n) + '" aria-hidden="true"></i>' + esc(n) + '</span>';
    }).join('') : '[Inks]';

    // True relative size: the long side over 17 in (the largest sheet), softened only a little
    // so a 4 × 6 in postcard still reads as a picture. 11 × 17 fills the mat.
    var m = String(w.size).match(/([\d.]+)\s*[×x]\s*([\d.]+)\s*in/);
    var real = m ? Math.min(1, Math.max(+m[1], +m[2]) / 17) : 1;
    var fill = (.22 + .78 * real).toFixed(3);

    // Layers: the paper at the bottom, one see-through sheet per ink in printing order,
    // pulled apart in 3D like the Drums view in Riso Studio (Jon, 11/27: "the earlier 3D layer view").
    var PAPER_TONE = '#f1eee6';   // Speckletone, lightened so it reads as paper rather than cream
    var layersView = '', byInk = '', legend = '';
    if (hasLayers) {
      var sheets = [{ cls: 'paper', name: String(w.paper).split(',')[0], sub: 'Paper' }].concat(w.inks.map(function (n, k) {
        return { cls: 'ink', name: n, sub: 'Pass ' + (k + 1), src: w.layers[k] };
      }));
      layersView =
        '<button type="button" class="stack3d" data-stack style="--n:' + sheets.length + '" aria-label="Pull the inks apart or stack them back">' +
          sheets.map(function (s, k) {
            return s.src
              ? '<img class="sheet3d ink" style="--i:' + k + '" src="' + esc(s.src) + '" alt="" loading="lazy">'
              : '<span class="sheet3d paper" style="--i:' + k + ';background:' + PAPER_TONE + '"></span>';
          }).join('') +
        '</button>' +
        '<ol class="s3-labels">' + sheets.map(function (s, k) {
          return '<li data-label="' + k + '"><button type="button" data-focus="' + k + '"><span class="mono mute">' + esc(s.sub) + '</span> ' + esc(s.name) + '</button></li>';
        }).reverse().join('') + '</ol>';
      legend = '<div class="pp-legend" data-legend hidden>' +
        sheets.map(function (s, k) {
          return '<button type="button" class="lg" data-focus="' + k + '"><i style="background:' + (s.src ? hex(s.name) : PAPER_TONE) + '"></i>' + esc(s.src ? s.name : 'Paper') +
            (s.src ? ' <span class="mute">' + esc(s.sub.toLowerCase()) + '</span>' : '') + '</button>';
        }).join('') +
        '<button type="button" class="pp-toggle" data-toggle>Stack</button>' +
      '</div>';
      // Ink by ink: each separation flat on its own sheet, then the finished print.
      if (w.layersFrom === 'scan') legend = legend.replace('<button type="button" class="pp-toggle"', '<span class="pp-est mono mute">Split from the scan. No separation file survives.</span><button type="button" class="pp-toggle"');
      byInk = '<div class="byink" style="--cols:' + Array(w.inks.length + 1).join('minmax(0, 1fr) auto ') + 'minmax(0, 1fr)">' + w.inks.map(function (n, k) {
        return (k ? '<span class="op" aria-hidden="true">+</span>' : '') +
          '<figure><span class="bi-sheet" style="background:' + PAPER_TONE + '"><img src="' + esc(w.layers[k]) + '" alt="' + esc(n + ' layer') + '" loading="lazy"></span>' +
          '<figcaption><span class="mono mute">' + (k + 1) + '</span> ' + esc(n) + '</figcaption></figure>';
      }).join('') +
        '<span class="op" aria-hidden="true">=</span>' +
        '<figure><span class="bi-sheet"><img src="' + esc(w.image) + '" alt="" loading="lazy"></span><figcaption>The print</figcaption></figure>' +
      '</div>';
    }

    function titleOf(x) { return x.colorway ? '<span class="t">' + esc(x.title) + ', </span><span class="mute">' + esc(x.colorway) + '</span>' : esc(x.title); }

    root.innerHTML =
      '<div class="pp">' +
        '<div class="pp-fig">' +
          '<div class="pp-stage" data-stage data-on="print" style="--fill:' + fill + '">' +
            '<div class="pp-view" data-v="print"><span class="pp-img"><img src="' + esc(w.image) + '" alt="' + esc(fullTitle + ', scan of the print') + '"></span></div>' +
            (w.photo ? '<div class="pp-view" data-v="photo" hidden><span class="pp-img"><img src="' + esc(w.photo) + '" alt="' + esc(w.title + ', photographed') + '" loading="lazy"></span></div>' : '') +
            (layersView ? '<div class="pp-view" data-v="layers" hidden>' + layersView + '</div>' : '') +
            (byInk ? '<div class="pp-view" data-v="byink" hidden>' + byInk + '</div>' : '') +
            '<span class="pp-scale mono mute" data-scale>' + esc(w.size) + ' · shown to scale</span>' +
          '</div>' +
          (views.length > 1 ? '<div class="pp-under">' +
            '<div class="tabs" role="group" aria-label="View">' + views.map(function (v, k) {
              return '<button type="button" class="tab" data-view="' + v.key + '" aria-pressed="' + (k === 0) + '">' + v.label + '</button>';
            }).join('') + '</div>' +
            legend +
          '</div>' : '') +
        '</div>' +
        '<div class="pp-text">' +
          '<p class="kicker mono mute"><a href="catalog.html">Catalog</a><span aria-hidden="true"> / </span><span aria-current="page">' + esc(w.no) + '</span> · ' + esc(w.type) + ' · ' + esc(w.year) + '</p>' +
          '<h1 class="display">' + esc(w.title) + '</h1>' +
          (w.colorway ? '<div class="ways"><p class="by">' + esc(w.colorway) + '</p>' + (ways.length > 1 ? '<nav class="way-list" aria-label="Colorways">' + ways.map(function (j) {
            var x = WORKS[j];
            return '<a class="way' + (isSold(x) ? ' is-sold' : '') + '" href="' + pageUrl(x) + '"' + (j === idx ? ' aria-current="page"' : '') + ' title="' + esc(x.colorway) + '" aria-label="' + esc(x.colorway) + '">' +
              x.inks.map(function (n) { return '<i style="background:' + hex(n) + '"></i>'; }).join('') + '</a>';
          }).join('') + '</nav>' : '') + '</div>' : '') +
          '<p class="about">' + esc(w.about) + '</p>' +
          '<dl class="facts">' +
            '<dt>Inks</dt><dd class="inklist">' + inkList + '</dd>' +
            '<dt>Size</dt><dd>' + esc(w.size) + (w.pages ? ' · ' + esc(w.pages) : '') + '</dd>' +
            '<dt>Paper</dt><dd>' + esc(w.paper) + '</dd>' +
            '<dt>Edition</dt><dd>' + editionText(w) + '</dd>' +
          '</dl>' +
          '<div class="pp-buy">' + buy + '</div>' +
        '</div>' +
      '</div>' +
      '<nav class="pp-pager" aria-label="More prints">' +
        (prev ? '<a href="' + pageUrl(prev) + '"><span class="mono mute">Previous · ' + esc(prev.no) + '</span><span class="display">' + titleOf(prev) + '</span></a>' : '<span></span>') +
        (next ? '<a class="nx" href="' + pageUrl(next) + '"><span class="mono mute">Next · ' + esc(next.no) + '</span><span class="display">' + titleOf(next) + '</span></a>' : '<span></span>') +
      '</nav>';

    // ----- Views -----
    var stage = root.querySelector('[data-stage]');
    var legendBox = root.querySelector('[data-legend]');
    var stack = root.querySelector('[data-stack]');
    var toggle = root.querySelector('[data-toggle]');
    var labels = root.querySelectorAll('[data-label]');
    var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var open = false;

    // Each label sits level with the middle of its sheet, to the right of the stack.
    function placeLabels() {
      if (!stack) return;
      var box = stack.parentNode.getBoundingClientRect();
      var right = 0;
      var rects = Array.prototype.map.call(stack.querySelectorAll('.sheet3d'), function (el) {
        var r = el.getBoundingClientRect(); right = Math.max(right, r.right); return r;
      });
      labels.forEach(function (l) {
        var r = rects[Number(l.getAttribute('data-label'))];
        l.style.left = (right - box.left + 20) + 'px';
        l.style.top = (r.top + r.height / 2 - box.top) + 'px';
      });
    }
    // The stack takes the shape of the plates, so a landscape print lies landscape.
    if (stack) {
      var first = stack.querySelector('img.sheet3d');
      var shape = function () { if (first.naturalWidth) { stack.style.aspectRatio = first.naturalWidth + ' / ' + first.naturalHeight; stack.classList.toggle('is-wide', first.naturalWidth > first.naturalHeight); } };
      first.complete ? shape() : first.addEventListener('load', shape, { once: true });
    }
    function setOpen(o) {
      open = o;
      if (!stack) return;
      stack.classList.toggle('open', o);
      stage.classList.toggle('is-open', o);
      toggle.textContent = o ? 'Stack' : 'Separate';
      setTimeout(placeLabels, still ? 0 : 950);
    }
    function focusSheet(k) {
      if (!stack) return;
      stack.querySelectorAll('.sheet3d').forEach(function (el) { el.classList.toggle('is-focus', el.style.getPropertyValue('--i') === String(k)); });
      stack.classList.toggle('has-focus', k != null);
      labels.forEach(function (l) { l.classList.toggle('is-focus', l.getAttribute('data-label') === String(k)); });
      root.querySelectorAll('[data-focus]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-focus') === String(k))); });
    }
    function show(v) {
      root.querySelectorAll('[data-view]').forEach(function (x) { x.setAttribute('aria-pressed', String(x.getAttribute('data-view') === v)); });
      root.querySelectorAll('.pp-view').forEach(function (x) { x.hidden = x.getAttribute('data-v') !== v; });
      stage.setAttribute('data-on', v);
      if (legendBox) legendBox.hidden = v !== 'layers';
      if (v === 'layers') { setOpen(false); focusSheet(null); setTimeout(function () { setOpen(true); }, still ? 0 : 200); }
    }
    root.querySelectorAll('[data-view]').forEach(function (b) {
      b.addEventListener('click', function () { show(b.getAttribute('data-view')); });
    });
    if (stack) {
      stack.addEventListener('click', function () { setOpen(!open); });
      toggle.addEventListener('click', function () { setOpen(!open); });
      root.querySelectorAll('[data-focus]').forEach(function (b) {
        var k = Number(b.getAttribute('data-focus'));
        b.addEventListener('mouseenter', function () { if (open) focusSheet(k); });
        b.addEventListener('mouseleave', function () { if (b.getAttribute('aria-pressed') !== 'true' || !b.matches(':focus')) focusSheet(null); });
        b.addEventListener('click', function () {
          if (!open) setOpen(true);
          focusSheet(b.getAttribute('aria-pressed') === 'true' && stack.classList.contains('has-focus') ? null : k);
        });
      });
      // A gentle turn of the stack as the pointer moves across the mat.
      if (!still && window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches) {
        var view = stack.parentNode;
        view.addEventListener('pointermove', function (e) {
          if (!open) return;
          var r = view.getBoundingClientRect();
          var dx = (e.clientX - r.left) / r.width - .5, dy = (e.clientY - r.top) / r.height - .5;
          stack.style.setProperty('--rz', (-34 + dx * 10).toFixed(2) + 'deg');
          stack.style.setProperty('--rx', (56 - dy * 8).toFixed(2) + 'deg');
        });
        view.addEventListener('pointerleave', function () {
          stack.style.removeProperty('--rz'); stack.style.removeProperty('--rx');
        });
      }
      window.addEventListener('resize', placeLabels);
    }

    // Left and right arrow keys step to the previous or next print (not while typing or choosing a format).
    document.addEventListener('keydown', function (e) {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable]')) return;
      var to = e.key === 'ArrowLeft' ? prev : e.key === 'ArrowRight' ? next : null;
      if (to) location.href = pageUrl(to);
    });
  }

  /* ---------- Email signup (free Kit form; id in works.js) ---------- */
  function signup() {
    var id = window.BPC_SIGNUP_FORM || '';
    var html = function (cls) {
      return '<form class="signup ' + cls + '"' + (id ? ' action="https://app.kit.com/forms/' + esc(id) + '/subscriptions" method="post"' : '') + '>' +
        '<label for="su-' + cls + '">Get an email when we have new prints.</label>' +
        '<span class="su-row"><input id="su-' + cls + '" type="email" name="email_address" required placeholder="you@example.com" autocomplete="email"' + (id ? '' : ' disabled') + '>' +
        '<button type="submit" class="btn"' + (id ? '' : ' disabled') + '>Sign up</button></span>' +
        (id ? '' : '<span class="mono mute">[Signup coming soon]</span>') +
      '</form>';
    };
    var foot = document.querySelector('.site-footer .bar');
    if (foot) foot.insertAdjacentHTML('beforebegin', html('foot'));
    var side = document.querySelector('.side-foot');
    if (side) side.insertAdjacentHTML('beforebegin', html('side'));
    if (!id) return;
    // Kit signup (Nov 28, Jon: "It should be setup"). Send in the background so the
    // visitor stays on the page; if that fails for any reason, fall back to a plain
    // form post, which lands on Kit's own confirmation page.
    document.querySelectorAll('form.signup').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        if (!window.fetch || !window.FormData) return;
        e.preventDefault();
        var btn = f.querySelector('button');
        var note = f.querySelector('.su-note') || f.appendChild(document.createElement('span'));
        note.className = 'su-note mono';
        note.setAttribute('role', 'status');
        btn.disabled = true;
        note.textContent = 'Sending…';
        fetch(f.action, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } })
          .then(function (r) { return r.json(); })
          .then(function (d) {
            if (d && d.status === 'success') {
              f.querySelector('.su-row').remove();
              note.textContent = 'Thanks. Check your email to confirm.';
            } else {
              btn.disabled = false;
              note.textContent = (d && d.errors && d.errors.messages && d.errors.messages[0]) || 'That didn\'t work. Check the address and try again.';
            }
          })
          .catch(function () { f.submit(); });
      });
    });
  }

  // Images fade in once loaded (design polish 2, Nov 28).
  function fadeImages(root) {
    root.querySelectorAll('main img').forEach(function (im) {
      if (im.complete && im.naturalWidth) return;
      im.classList.add('ld', 'ld-in');
      var done = function () { im.classList.remove('ld'); };
      im.addEventListener('load', done, { once: true });
      im.addEventListener('error', done, { once: true });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    signup();
    var page = document.body.getAttribute('data-page');
    if (page === 'shop') shop(document);
    if (page === 'catalog') catalogue(document);
    if (page === 'printing') inkPicker(document);
    if (page === 'print') printPage(document.querySelector('[data-print]'));
    if (page === 'shop' || page === 'catalog') {
      openFromHash();
      window.addEventListener('hashchange', openFromHash);
    }
    fadeImages(document);
    var y = document.querySelector('[data-year]');
    if (y) y.textContent = new Date().getFullYear();
  });
})();
