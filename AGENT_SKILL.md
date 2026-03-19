# Agent Skill: Vietnamese Book Reviewer Site

> **Version:** 1.0 | **Stack:** Pure HTML/CSS/JS — no build tools | **Language:** Vietnamese output

---

## 1. CORE OBJECTIVE

Tự động hóa toàn bộ quy trình review sách cho một static website tiếng Việt:
**Input:** Tên sách + Tác giả → **Output:** file `books/[slug].html` + card trong `index.html` + cập nhật `TAGS.md`

Thành công khi:
- `books/[slug].html` đúng template, đúng màu bìa, nội dung review đầy đủ 5 phần
- Card xuất hiện ở **đầu** danh sách trong `index.html` (newest first)
- Tags đúng taxonomy (≤ 2 tags), HTML entities encode đúng (`&` → `&amp;`)
- `TAGS.md` có entry mới trong bảng mapping

---

## 2. REPOSITORY LAYOUT

```
/
├── index.html          # Homepage — book grid + tag filter bar
├── books/
│   └── [slug].html     # One file per book
├── assets/
│   ├── style.css       # Vintage CSS — DO NOT modify when reviewing books
│   └── book.js         # Auto-sets href on <a class="tag-link"> via encodeURIComponent
├── TAGS.md             # 10-tag taxonomy + reviewed books mapping table
└── CLAUDE.md           # Master instructions (origin of this skill)
```

---

## 3. TAG TAXONOMY (fixed — max 2 tags per book)

| Tag | Scope |
|-----|-------|
| `Tài chính & Đầu tư` | Tài chính cá nhân, đầu tư, tài chính doanh nghiệp |
| `Kinh doanh & Chiến lược` | Chiến lược công ty, cạnh tranh, startup |
| `Lãnh đạo & Quản trị` | Lãnh đạo, quản lý đội nhóm, vận hành, tổ chức |
| `Tư duy & Ra quyết định` | Mô hình tư duy, thiên kiến nhận thức, ra quyết định |
| `Tâm lý học & Hành vi` | Tâm lý học, kinh tế hành vi, thuyết phục |
| `Năng suất & Thói quen` | Năng suất, thói quen, tập trung, phát triển bản thân |
| `Lịch sử & Xã hội` | Lịch sử, văn hóa, chính trị, xã hội học |
| `Khoa học & Công nghệ` | Khoa học, công nghệ, đổi mới, tương lai |
| `Hư cấu & Tiểu thuyết` | Tiểu thuyết, business novel, fiction |
| `Truyền cảm hứng` | Tiểu sử, hồi ký, câu chuyện vượt khó |

**Rules:**
- Max 2 tags. Ưu tiên tag nội dung trước tag hình thức
- Fiction/Novel: tag 1 = chủ đề nội dung, tag 2 = `Hư cấu & Tiểu thuyết`
- Không tạo tag mới nếu sách fit vào tag hiện có
- Khi buộc phải tạo tag mới: cập nhật TAGS.md, đảm bảo tag đủ rộng cho ≥ 5 cuốn tương lai

---

## 4. COLOR PALETTE (rotate, avoid repeating in adjacent cards)

```
#8B4513  nâu saddle        #4B3832  nâu cappuccino
#2F4F4F  xanh teal tối     #1C3A4A  xanh navy tối
#556B2F  xanh olive        #5C4033  nâu mocha
#8B0000  đỏ đậm            #3B5323  xanh rừng
```

Để chọn màu: đọc 2–3 card đầu trong `index.html`, tránh màu nào đang dùng gần nhất.

---

## 5. EXECUTION PLAN (per book)

### Step 1 — Generate Slug

Lowercase, remove Vietnamese diacritics, kebab-case, only `a-z0-9-`:

```
"Khởi Nghiệp Tinh Gọn"        → khoi-nghiep-tinh-gon
"Đắc Nhân Tâm"                → dac-nhan-tam
"Tư Duy Nhanh Và Chậm"        → tu-duy-nhanh-va-cham
"Sapiens: Lược Sử Loài Người" → sapiens-luoc-su-loai-nguoi
```

### Step 2 — Select Tags (≤ 2)

Đọc TAGS.md mapping table → kiểm tra các sách đã review để tránh pattern lặp → gán tag phù hợp nhất.

### Step 3 — Select Cover Color

Đọc 2–3 card đầu trong `index.html` → chọn màu CHƯA xuất hiện trong các card liền kề.

### Step 4 — Tìm & Tải ảnh bìa (BẮT BUỘC)

Tìm ảnh bìa sách trên mạng → tải về `assets/images/[slug].jpg`.

**Quy trình:**
1. Tìm ảnh bìa tiếng Việt trước (ưu tiên bản dịch Việt). Nếu không có, dùng bìa gốc.
2. Nguồn tìm: Google Images, Tiki, Fahasa, hoặc trang nhà xuất bản.
3. Tải file ảnh về bằng `curl -L -o assets/images/[slug].jpg "[URL_ẢNH]"`.
4. Ưu tiên ảnh chất lượng tốt, kích thước ≥ 200px chiều rộng.
5. Nếu không tìm được ảnh phù hợp → thông báo cho user và tiếp tục các bước còn lại (row trong index vẫn hiển thị màu nền fallback).

> **Lưu ý:** File ảnh PHẢI có tên đúng `[slug].jpg` để khớp với `<img>` trong index row.

### Step 5 — Create `books/[slug].html`

Sinh nội dung review theo **Review Prompt** (Section 6), render vào **Book Page Template** (Section 7).

### Step 6 — Update `index.html`

Tìm `<!-- BOOK CARDS -->` → chèn card mới **ngay sau** comment (newest first).
Dùng **Card Template** (Section 8). `&` → `&amp;` trong `data-tags` và `data-tag`.

### Step 7 — Update `TAGS.md`

Thêm dòng vào bảng **Mapping các sách đã review**:
```
| Tên Sách | Tag1 · Tag2 |
```

### Step 8 — Verify Checklist

- [ ] `books/[slug].html` đã tạo
- [ ] Card ở vị trí đầu tiên sau `<!-- BOOK CARDS -->`
- [ ] `&` được encode thành `&amp;` trong tất cả `data-tags` và `data-tag`
- [ ] Tag chủ đề dùng `<a class="tag tag-link">` KHÔNG có `href` — book.js tự set
- [ ] Tag meta ("Phi hư cấu", năm) dùng `<span class="tag">` — không phải `<a>`
- [ ] Màu bìa trong hero page khớp với màu trong card index
- [ ] Ảnh bìa `assets/images/[slug].jpg` đã tồn tại

---

## 6. REVIEW PROMPT

Áp dụng prompt sau, điền `[Tên Sách]` và `[Tên Tác Giả]`:

---

Hãy đóng vai một chuyên gia tóm tắt sách và một nhà huấn luyện tư duy. Tôi muốn lĩnh hội cuốn **[Tên Sách]** của **[Tên Tác Giả]** trong 5 phút đọc. Tóm tắt theo cấu trúc sau:

**1. Thông điệp Hạt nhân (Core Message)**
Viết duy nhất 1 câu tóm tắt tư tưởng lớn nhất mà cuốn sách muốn truyền tải.

**2. 5 Nguyên tắc Vàng (Big Ideas)**
Liệt kê 5 bài học/tư duy quan trọng nhất. Với mỗi mục, giải thích:
- Nó là gì?
- Tại sao nó quan trọng?
- Áp dụng vào thực tế như thế nào?

**3. Thay đổi Thế giới quan**
Những quan niệm sai lầm nào mà cuốn sách này giúp gỡ bỏ?
(So sánh Trước → Sau khi đọc, tối thiểu 3–4 cặp)

**4a. Kế hoạch Hành động 1 phút** *(áp dụng cho sách phi hư cấu)*
3 việc cụ thể có thể làm ngay hôm nay để thay đổi cuộc sống.

**4b. Nhân vật/tình huống đáng suy ngẫm** *(áp dụng cho sách hư cấu/fiction)*
Nhân vật hoặc tình huống nào khiến người đọc suy nghĩ lâu nhất, và tại sao nó có sức nặng như vậy?

**5. Câu trích dẫn đắt nhất**
Một câu trích dẫn tóm gọn tinh thần của cả cuốn sách.

---

**HTML rendering conventions khi viết vào file:**
- `<h2>` — mỗi phần chính
- `<h3>` — mỗi nguyên tắc vàng, đánh số: `1. Tên nguyên tắc — Tagline ngắn`
- `<p>` — đoạn văn; `<ul>` / `<ol>` — danh sách
- `<blockquote><p>...</p><cite>— Tác giả, Tên Sách</cite></blockquote>` — trích dẫn

---

## 7. BOOK PAGE TEMPLATE

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Tên sách] — Book Review</title>
  <link rel="stylesheet" href="../assets/style.css">
  <script src="../assets/book.js" defer></script>
</head>
<body class="book-page">
  <header class="site-header">
    <a href="../index.html" class="back-link">← Tủ sách</a>
  </header>

  <main class="book-detail">
    <div class="book-hero">
      <div class="hero-cover" style="background: [COLOR_HEX]">
        <span class="book-spine"></span>
      </div>
      <div class="hero-meta">
        <h1 class="hero-title">[Tên sách]</h1>
        <p class="hero-author">— [Tên tác giả]</p>
        <div class="hero-tags">
          <!-- TAG CHỦ ĐỀ: <a class="tag tag-link"> — KHÔNG đặt href, book.js tự set -->
          <a class="tag tag-link">[Tag 1 từ taxonomy]</a>
          <a class="tag tag-link">[Tag 2 nếu có]</a>
          <!-- TAG META: <span> thường, không clickable -->
          <span class="tag">Phi hư cấu</span>
          <span class="tag">[Năm xuất bản]</span>
        </div>
      </div>
    </div>

    <article class="review-body">

      <h2>Thông điệp Hạt nhân</h2>
      <p>[1 câu core message]</p>

      <h2>5 Nguyên tắc Vàng</h2>

      <h3>1. [Tên nguyên tắc] — [Tagline]</h3>
      <p><strong>Là gì?</strong> ...</p>
      <p><strong>Tại sao quan trọng?</strong> ...</p>
      <p><strong>Áp dụng thực tế:</strong> ...</p>

      <!-- repeat h3 block for principles 2–5 -->

      <h2>Thay đổi Thế giới quan</h2>
      <ul>
        <li><strong>Trước:</strong> ... → <strong>Sau:</strong> ...</li>
        <!-- 3–4 items -->
      </ul>

      <h2>Kế hoạch Hành động — 3 việc ngay hôm nay</h2>
      <ol>
        <li><strong>[Tên việc]:</strong> ...</li>
        <li><strong>[Tên việc]:</strong> ...</li>
        <li><strong>[Tên việc]:</strong> ...</li>
      </ol>

      <h2>Câu trích dẫn đắt nhất</h2>
      <blockquote>
        <p>"[Trích dẫn]"</p>
        <cite>— [Tác giả], [Tên sách]</cite>
      </blockquote>

    </article>
  </main>

  <footer class="site-footer">
    <p>✦ Tủ sách cá nhân ✦</p>
  </footer>
</body>
</html>
```

> **CRITICAL:** `<a class="tag tag-link">` — KHÔNG đặt `href`. Script `book.js` đọc `textContent`
> và tự set `href = ../index.html#tag=encodeURIComponent(tag)`. Hardcode href với ký tự Vietnamese sẽ bị encoding sai.

---

## 8. CARD TEMPLATE (index.html)

Chèn ngay sau dòng `<!-- BOOK CARDS -->`:

```html
<a href="books/[slug].html" class="book-card" data-tags="[TAG1_ENCODED]">
  <div class="book-cover" style="background: [COLOR_HEX]">
    <span class="book-spine"></span>
  </div>
  <div class="book-info">
    <h2 class="book-title">[Tên sách]</h2>
    <p class="book-author">[Tên tác giả]</p>
    <div class="card-tags">
      <span class="card-tag" data-tag="[TAG1_ENCODED]">[TAG1_ENCODED]</span>
      <!-- nếu có tag 2: -->
      <span class="card-tag" data-tag="[TAG2_ENCODED]">[TAG2_ENCODED]</span>
    </div>
    <p class="book-excerpt">[2–3 câu mô tả ngắn, hấp dẫn, tiếng Việt]</p>
    <span class="read-more">Đọc review →</span>
  </div>
</a>
```

**HTML encoding bắt buộc:**

| Raw | Trong HTML attribute |
|-----|----------------------|
| `Tài chính & Đầu tư` | `Tài chính &amp; Đầu tư` |
| `Tư duy & Ra quyết định` | `Tư duy &amp; Ra quyết định` |

`data-tags` nhận nhiều tag ngăn bằng `,` (không có space quanh dấu phẩy):
`data-tags="Tư duy &amp; Ra quyết định,Tâm lý học &amp; Hành vi"`

---

## 9. SCRIPTS — Reference Implementations

### `assets/book.js`

```javascript
// Auto-set href for tag-link based on textContent
// Avoids hardcoding URL-encoded Vietnamese in HTML
document.querySelectorAll('a.tag-link').forEach(function (a) {
  var tag = a.textContent.trim();
  if (tag) a.href = '../index.html#tag=' + encodeURIComponent(tag);
});
```

### `index.html` — Inline filter script

```javascript
const cards = [...document.querySelectorAll('.book-card')];
const filterBar = document.getElementById('tag-filters');

// Pre-parse tags once — not on every filter call
const cardTagsMap = new Map(
  cards.map(c => [c, c.dataset.tags.split(',').map(t => t.trim())])
);
const allTags = [...new Set(cards.flatMap(c => cardTagsMap.get(c)))].sort();

// Build filter bar dynamically from data-tags
['Tất cả', ...allTags].forEach(tag => {
  const btn = document.createElement('button');
  btn.className = 'tag-filter-btn';
  btn.textContent = tag;
  btn.dataset.tag = tag;
  filterBar.appendChild(btn);
});

// Cache NodeList after building (not inside filter loop)
const filterBtns = filterBar.querySelectorAll('.tag-filter-btn');
let activeTag = null;

function filterByTag(tag) {
  if (tag === activeTag) return;  // early-exit if same tag
  activeTag = tag;
  cards.forEach(card => {
    card.hidden = tag !== 'Tất cả' && !cardTagsMap.get(card).includes(tag);
  });
  filterBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tag === tag);
  });
  const hash = tag === 'Tất cả' ? '' : '#tag=' + encodeURIComponent(tag);
  history.replaceState(null, '', location.pathname + hash);
}

// Apply filter from URL hash (on load and browser back/forward)
function applyHashFilter() {
  const m = location.hash.match(/^#tag=(.+)$/);
  filterByTag(m ? decodeURIComponent(m[1]) : 'Tất cả');
}
window.addEventListener('hashchange', applyHashFilter);

// Event delegation — filter bar buttons
filterBar.addEventListener('click', e => {
  const btn = e.target.closest('.tag-filter-btn');
  if (btn) filterByTag(btn.dataset.tag);
});

// Event delegation — card tags (filter without navigating into book page)
document.querySelector('.book-grid').addEventListener('click', e => {
  const cardTag = e.target.closest('.card-tag');
  if (cardTag) {
    e.preventDefault();
    e.stopPropagation();
    filterByTag(cardTag.dataset.tag);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

applyHashFilter();
```

---

## 10. EXAMPLES

### Example A — Non-fiction, 1 tag

**Input:** `Khởi Nghiệp Tinh Gọn — Eric Ries`
**Slug:** `khoi-nghiep-tinh-gon` | **Tag:** `Kinh doanh & Chiến lược` | **Color:** `#556B2F`

**Card:**
```html
<a href="books/khoi-nghiep-tinh-gon.html" class="book-card"
   data-tags="Kinh doanh &amp; Chiến lược">
  <div class="book-cover" style="background: #556B2F">
    <span class="book-spine"></span>
  </div>
  <div class="book-info">
    <h2 class="book-title">Khởi Nghiệp Tinh Gọn</h2>
    <p class="book-author">Eric Ries</p>
    <div class="card-tags">
      <span class="card-tag" data-tag="Kinh doanh &amp; Chiến lược">
        Kinh doanh &amp; Chiến lược
      </span>
    </div>
    <p class="book-excerpt">Phần lớn startup thất bại vì dành quá nhiều thời gian xây sản phẩm
    mà không ai cần. Lean Startup đề xuất vòng lặp Build–Measure–Learn: xây dựng nhanh,
    đo lường thực, học từ dữ liệu — để rút ngắn thời gian từ giả định đến sự thật được kiểm chứng.</p>
    <span class="read-more">Đọc review →</span>
  </div>
</a>
```

**Hero tags (book page):**
```html
<a class="tag tag-link">Kinh doanh &amp; Chiến lược</a>
<span class="tag">Phi hư cấu</span>
<span class="tag">2011</span>
```

---

### Example B — Non-fiction, 2 tags

**Input:** `Tư Duy Nhanh Và Chậm — Daniel Kahneman`
**Slug:** `tu-duy-nhanh-va-cham` | **Tags:** `Tư duy & Ra quyết định` + `Tâm lý học & Hành vi` | **Color:** `#3B5323`

**Card `data-tags`:**
```html
data-tags="Tư duy &amp; Ra quyết định,Tâm lý học &amp; Hành vi"
```

**Card tags block:**
```html
<div class="card-tags">
  <span class="card-tag" data-tag="Tư duy &amp; Ra quyết định">
    Tư duy &amp; Ra quyết định
  </span>
  <span class="card-tag" data-tag="Tâm lý học &amp; Hành vi">
    Tâm lý học &amp; Hành vi
  </span>
</div>
```

**Hero tags (book page):**
```html
<a class="tag tag-link">Tư duy &amp; Ra quyết định</a>
<a class="tag tag-link">Tâm lý học &amp; Hành vi</a>
<span class="tag">Phi hư cấu</span>
<span class="tag">2011</span>
```

---

### Example C — Business Novel (fiction + content tag)

**Input:** `Mục Tiêu (The Goal) — Eliyahu M. Goldratt`
**Tags:** `Lãnh đạo & Quản trị` + `Hư cấu & Tiểu thuyết`

Review section 4 → thay bằng **"Nhân vật/tình huống đáng suy ngẫm"**, không phải Kế hoạch Hành động.

---

## 11. BATCH PROCESSING (nhiều sách cùng lúc)

1. **Pre-plan trước:** Với mỗi sách, xác định slug + tags + màu (tránh trùng màu liền kề)
2. **Tạo tất cả book pages** (có thể song song)
3. **Cập nhật `index.html` một lần** — prepend tất cả cards theo thứ tự mới nhất trước
4. **Cập nhật `TAGS.md` một lần** — append tất cả rows vào mapping table
5. **Verify toàn bộ** trước khi commit

**Thứ tự màu gợi ý cho 6 sách liên tiếp:**
```
Sách 1: #1C3A4A  (navy)
Sách 2: #5C4033  (mocha)
Sách 3: #3B5323  (forest)
Sách 4: #8B4513  (saddle)
Sách 5: #2F4F4F  (teal)
Sách 6: #556B2F  (olive)
```

---

## 12. COMMON MISTAKES

| ❌ Sai | ✅ Đúng |
|--------|---------|
| `<a class="tag tag-link" href="...">` | `<a class="tag tag-link">` — không href, book.js tự set |
| `data-tags="Tài chính & Đầu tư"` | `data-tags="Tài chính &amp; Đầu tư"` |
| Thêm card vào cuối grid | Thêm ngay sau `<!-- BOOK CARDS -->` (lên đầu) |
| `<a class="tag">Phi hư cấu</a>` | `<span class="tag">Phi hư cấu</span>` — không clickable |
| Màu hero page ≠ màu card | Cùng `COLOR_HEX` trong cả hai nơi |
| Quên cập nhật TAGS.md | Luôn thêm mapping row sau mỗi review |
| Tạo tag hẹp ("Startup", "VC") | Dùng tag rộng đã có ("Kinh doanh & Chiến lược") |

---

*Skill distilled from production build — including bugs found and fixed in real usage.*
