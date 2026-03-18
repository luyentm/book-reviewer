(function () {
  // ── Audio: tạo một lần, tồn tại xuyên suốt các navigation ──────────────
  function initAudio() {
    if (document.getElementById('bg-audio')) return;
    var isBook = location.pathname.includes('/books/');
    var audio = document.createElement('audio');
    audio.id = 'bg-audio';
    audio.src = (isBook ? '../' : '') + 'assets/music/bg.mp3';
    audio.loop = true;
    audio.volume = 0.2;
    audio.preload = 'none';
    document.body.appendChild(audio);

    var started = false;
    function tryPlay() {
      if (started) return;
      audio.play().then(function () { started = true; }).catch(function () {});
    }
    tryPlay();
    ['click', 'keydown', 'scroll', 'touchstart'].forEach(function (evt) {
      document.addEventListener(evt, tryPlay, { passive: true });
    });
  }

  // ── Page init: chạy lại sau mỗi lần swap ────────────────────────────────
  function initPage() {
    initTagLinks();
    if (document.querySelector('.book-grid')) initFilterBar();
  }

  function initTagLinks() {
    var isBook = location.pathname.includes('/books/');
    document.querySelectorAll('a.tag-link').forEach(function (a) {
      var tag = a.textContent.trim();
      if (tag) a.href = (isBook ? '../' : '') + 'index.html#tag=' + encodeURIComponent(tag);
    });
  }

  function initFilterBar() {
    var filterBar = document.getElementById('tag-filters');
    if (!filterBar) return;
    filterBar.innerHTML = '';  // reset nếu gọi lại lần 2

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

    // Apply hash filter sau khi init
    var m = location.hash.match(/^#tag=(.+)$/);
    filterByTag(m ? decodeURIComponent(m[1]) : 'Tất cả');

    // hashchange chỉ relevant khi ở index
    window.onhashchange = function () {
      var hm = location.hash.match(/^#tag=(.+)$/);
      filterByTag(hm ? decodeURIComponent(hm[1]) : 'Tất cả');
    };
  }

  // ── PJAX Router ──────────────────────────────────────────────────────────
  function isInternal(href) {
    try {
      var url = new URL(href, location.href);
      return url.hostname === location.hostname &&
             (url.pathname.endsWith('.html') || url.pathname.endsWith('/'));
    } catch (e) { return false; }
  }

  function navigate(url, push) {
    fetch(url).then(function (r) { return r.text(); }).then(function (html) {
      var doc = new DOMParser().parseFromString(html, 'text/html');
      var newMain = doc.querySelector('main');
      var curMain = document.querySelector('main');
      if (newMain && curMain) curMain.replaceWith(newMain);
      document.title = doc.title;
      document.body.className = doc.body.className;
      if (push) history.pushState(null, '', url);
      window.scrollTo(0, 0);
      initPage();
    });
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a || !a.href || e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (!isInternal(a.href)) return;
    e.preventDefault();
    navigate(a.href, true);
  });

  window.addEventListener('popstate', function () {
    navigate(location.href, false);
  });

  // ── Bootstrap ────────────────────────────────────────────────────────────
  initAudio();
  initPage();
})();
