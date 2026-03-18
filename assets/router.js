(function () {
  // ── TTS ──────────────────────────────────────────────────────────────────
  var viVoice = null;

  function loadViVoice(cb) {
    if (viVoice) { cb(viVoice); return; }
    function find() {
      var voices = speechSynthesis.getVoices();
      // Ưu tiên: Google tiếng Việt → bất kỳ vi-VN → vi
      var v = voices.find(function(v){ return v.lang === 'vi-VN' && /google/i.test(v.name); })
           || voices.find(function(v){ return v.lang === 'vi-VN'; })
           || voices.find(function(v){ return v.lang.startsWith('vi'); });
      if (v) viVoice = v;
      cb(v || null);
    }
    var voices = speechSynthesis.getVoices();
    if (voices.length) {
      find();
    } else {
      // Fallback timeout: nếu voiceschanged không bao giờ fire thì vẫn speak
      var t = setTimeout(function() { cb(null); }, 1500);
      speechSynthesis.addEventListener('voiceschanged', function() {
        clearTimeout(t);
        find();
      }, { once: true });
    }
  }

  function initTTS() {
    var article = document.querySelector('.review-body');
    if (!article || !window.speechSynthesis) return;

    var bar = document.createElement('div');
    bar.className = 'tts-bar';
    bar.innerHTML =
      '<button class="tts-btn" id="tts-play">▶ Nghe bài</button>' +
      '<button class="tts-btn tts-stop" id="tts-stop" hidden>✕ Dừng</button>';

    var heroMeta = document.querySelector('.hero-meta');
    if (heroMeta) heroMeta.appendChild(bar);

    var playBtn = document.getElementById('tts-play');
    var stopBtn = document.getElementById('tts-stop');
    var speaking = false;
    var paused = false;
    var keepAlive = null;
    var text = article.innerText;

    function startKeepAlive() {
      // Fix Chrome bug: speechSynthesis silently stops after ~15s on long text
      keepAlive = setInterval(function() {
        if (!speechSynthesis.speaking) { stopKeepAlive(); return; }
        if (!paused) { speechSynthesis.pause(); speechSynthesis.resume(); }
      }, 10000);
    }

    function stopKeepAlive() {
      if (keepAlive) { clearInterval(keepAlive); keepAlive = null; }
    }

    playBtn.addEventListener('click', function () {
      if (!speaking) {
        speaking = true; paused = false;
        playBtn.textContent = '⏸ Tạm dừng';
        stopBtn.hidden = false;
        loadViVoice(function (voice) {
          var utt = new SpeechSynthesisUtterance(text);
          utt.lang = 'vi-VN';
          utt.rate = 0.95;
          if (voice) utt.voice = voice;
          utt.onstart = startKeepAlive;
          utt.onend = function() { stopKeepAlive(); resetState(); };
          utt.onerror = function() { stopKeepAlive(); resetState(); };
          speechSynthesis.cancel();
          speechSynthesis.speak(utt);
        });
      } else if (!paused) {
        speechSynthesis.pause();
        paused = true;
        playBtn.textContent = '▶ Tiếp tục';
      } else {
        speechSynthesis.resume();
        paused = false;
        playBtn.textContent = '⏸ Tạm dừng';
      }
    });

    stopBtn.addEventListener('click', function () {
      stopKeepAlive();
      speechSynthesis.cancel();
      resetState();
    });

    window.addEventListener('beforeunload', function() {
      stopKeepAlive();
      speechSynthesis.cancel();
    });

    function resetState() {
      speaking = false; paused = false;
      playBtn.textContent = '▶ Nghe bài';
      stopBtn.hidden = true;
    }
  }

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
  initTTS();
})();
