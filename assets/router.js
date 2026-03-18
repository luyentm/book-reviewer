(function () {
  // ── Tag Links ─────────────────────────────────────────────────────────────
  function initTagLinks() {
    var isBook = location.pathname.includes('/books/');
    document.querySelectorAll('a.tag-link').forEach(function (a) {
      var tag = a.textContent.trim();
      if (tag) a.href = (isBook ? '../' : '') + 'index.html#tag=' + encodeURIComponent(tag);
    });
  }

  // ── Filter Bar (index only) ───────────────────────────────────────────────
  function initFilterBar() {
    var filterBar = document.getElementById('tag-filters');
    if (!filterBar) return;
    filterBar.innerHTML = '';

    var cards = Array.from(document.querySelectorAll('.book-card'));
    var cardTagsMap = new Map(
      cards.map(function (c) {
        return [c, c.dataset.tags.split(',').map(function (t) { return t.trim(); })];
      })
    );
    var allTags = Array.from(
      new Set([].concat.apply([], cards.map(function (c) { return cardTagsMap.get(c); })))
    ).sort();

    ['Tất cả'].concat(allTags).forEach(function (tag) {
      var btn = document.createElement('button');
      btn.className = 'tag-filter-btn';
      btn.textContent = tag;
      btn.dataset.tag = tag;
      filterBar.appendChild(btn);
    });

    var filterBtns = filterBar.querySelectorAll('.tag-filter-btn');
    var activeTag = null;

    function filterByTag(tag) {
      if (tag === activeTag) return;
      activeTag = tag;
      cards.forEach(function (card) {
        card.hidden = tag !== 'Tất cả' && !cardTagsMap.get(card).includes(tag);
      });
      filterBtns.forEach(function (btn) {
        btn.classList.toggle('active', btn.dataset.tag === tag);
      });
      var hash = tag === 'Tất cả' ? '' : '#tag=' + encodeURIComponent(tag);
      history.replaceState(null, '', location.pathname + hash);
    }

    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('.tag-filter-btn');
      if (btn) filterByTag(btn.dataset.tag);
    });

    var grid = document.querySelector('.book-grid');
    if (grid) {
      grid.addEventListener('click', function (e) {
        var ct = e.target.closest('.card-tag');
        if (ct) {
          e.preventDefault();
          e.stopPropagation();
          filterByTag(ct.dataset.tag);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }

    var m = location.hash.match(/^#tag=(.+)$/);
    filterByTag(m ? decodeURIComponent(m[1]) : 'Tất cả');

    window.onhashchange = function () {
      var hm = location.hash.match(/^#tag=(.+)$/);
      filterByTag(hm ? decodeURIComponent(hm[1]) : 'Tất cả');
    };
  }

  // ── Bootstrap ─────────────────────────────────────────────────────────────
  initTagLinks();
  if (document.querySelector('.book-grid')) initFilterBar();
})();
