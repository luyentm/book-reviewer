(function () {
  // ── Tag Links (book detail pages) ─────────────────────────────────────────
  function initTagLinks() {
    var isBook = location.pathname.includes('/books/');
    document.querySelectorAll('a.tag-link').forEach(function (a) {
      var tag = a.textContent.trim();
      if (tag) a.href = (isBook ? '../' : '') + 'index.html#tag=' + encodeURIComponent(tag);
    });
  }

  // ── Table filters: tag bar + name search ──────────────────────────────────
  function initTableFilters() {
    var filterBar = document.getElementById('tag-filters');
    var searchInput = document.getElementById('search-name');
    var rows = Array.from(document.querySelectorAll('.book-row'));
    if (!rows.length) return;

    var rowTagsMap = new Map(rows.map(function (r) {
      return [r, (r.dataset.tags || '').split(',').map(function (t) { return t.trim(); })];
    }));

    var activeTag = 'Tất cả';
    var searchQ = '';

    function normalize(s) {
      return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    }

    function applyFilters() {
      var q = normalize(searchQ);
      rows.forEach(function (row) {
        var tags = rowTagsMap.get(row) || [];
        var matchTag = activeTag === 'Tất cả' || tags.includes(activeTag);
        var matchSearch = !q || normalize(row.dataset.name || '').includes(q);
        row.hidden = !(matchTag && matchSearch);
      });
    }

    // ── Tag filter bar ──────────────────────────────────────────────────────
    if (filterBar) {
      filterBar.innerHTML = '';
      var allTags = Array.from(
        new Set([].concat.apply([], rows.map(function (r) { return rowTagsMap.get(r); })))
      ).sort();

      ['Tất cả'].concat(allTags).forEach(function (tag) {
        var btn = document.createElement('button');
        btn.className = 'tag-filter-btn';
        btn.textContent = tag;
        btn.dataset.tag = tag;
        filterBar.appendChild(btn);
      });

      var filterBtns = filterBar.querySelectorAll('.tag-filter-btn');

      function setTag(tag) {
        activeTag = tag;
        filterBtns.forEach(function (b) {
          b.classList.toggle('active', b.dataset.tag === tag);
        });
        var hash = tag === 'Tất cả' ? '' : '#tag=' + encodeURIComponent(tag);
        history.replaceState(null, '', location.pathname + hash);
        applyFilters();
      }

      filterBar.addEventListener('click', function (e) {
        var btn = e.target.closest('.tag-filter-btn');
        if (btn) setTag(btn.dataset.tag);
      });

      // Tag chips inside table rows
      document.addEventListener('click', function (e) {
        var ct = e.target.closest('.book-table .card-tag');
        if (ct) {
          e.stopPropagation();
          setTag(ct.dataset.tag);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });

      // Apply hash on load
      var m = location.hash.match(/^#tag=(.+)$/);
      setTag(m ? decodeURIComponent(m[1]) : 'Tất cả');

      window.onhashchange = function () {
        var hm = location.hash.match(/^#tag=(.+)$/);
        setTag(hm ? decodeURIComponent(hm[1]) : 'Tất cả');
      };
    }

    // ── Name search ─────────────────────────────────────────────────────────
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        searchQ = searchInput.value.trim();
        applyFilters();
      });
    }

    // ── Row click → navigate ─────────────────────────────────────────────────
    rows.forEach(function (row) {
      row.addEventListener('click', function (e) {
        if (e.target.closest('.card-tag')) return;
        if (e.target.closest('a')) return;
        var href = row.dataset.href;
        if (href) window.location.href = href;
      });
    });
  }

  // ── Bootstrap ─────────────────────────────────────────────────────────────
  initTagLinks();
  if (document.querySelector('.book-table')) initTableFilters();
})();
