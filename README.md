# 📚 Tủ Sách — AI-Powered Book Review Site

Một trang web review sách cá nhân, thuần HTML/CSS, được vận hành bởi AI.
Không cần code. Không cần build tool. Chỉ cần ra lệnh — AI tự làm phần còn lại.

## Xem demo

→ **[luyentm.github.io/book-reviewer](https://luyentm.github.io/book-reviewer)**

---

## Cách dùng (Fork về và tự vận hành)

### Bước 1 — Fork repo này

```
https://github.com/luyentm/book-reviewer
```

Fork về tài khoản của bạn, rồi clone xuống máy.

### Bước 2 — Bật GitHub Pages

Vào **Settings → Pages** trong repo của bạn:
- **Source:** GitHub Actions
- Lưu lại

Từ lần push tiếp theo, GitHub sẽ tự động build và deploy trang web.

### Bước 3 — Kết nối AI với repo

Mở repo bằng bất kỳ AI Agent nào hỗ trợ đọc file và chỉnh sửa code:

- **Claude Code** (khuyên dùng): `claude` trong terminal tại thư mục repo
- **Cursor**, **Windsurf**, **Copilot Workspace**, hay bất kỳ AI coding agent nào

**Bước quan trọng:** Đưa file `AGENT_SKILL.md` cho AI đọc. File này chứa toàn bộ hướng dẫn — workflow, templates, scripts, ví dụ. AI sẽ hiểu ngay cách vận hành repo mà không cần giải thích thêm.

> Với Claude Code: file `CLAUDE.md` trong repo sẽ tự động chỉ AI đọc `AGENT_SKILL.md` ngay khi khởi động session.

### Bước 4 — Review sách

Nói với AI:

```
Review sách: [Tên sách] - [Tên tác giả]
```

Ví dụ:
```
Review sách: Nhà Giả Kim - Paulo Coelho
Review sách: Atomic Habits - James Clear
Review sách: Sapiens - Yuval Noah Harari
```

AI sẽ tự động:
1. Tạo file `books/[slug].html` với review đầy đủ (5 phần: core message, 5 big ideas, world view shift, action plan, quote)
2. Thêm card vào `index.html`
3. Cập nhật `TAGS.md`

Commit và push lên GitHub → trang web tự động cập nhật sau vài giây.

---

## Cấu trúc repo

```
/
├── index.html              # Trang chủ — danh sách sách + filter theo tag
├── books/
│   └── [slug].html         # Mỗi cuốn sách = 1 file HTML
├── assets/
│   ├── style.css           # Giao diện vintage, tiếng Việt
│   └── book.js             # Xử lý tag filter và navigation
├── AGENT_SKILL.md          # Hướng dẫn đầy đủ cho AI (workflow, templates, scripts)
├── CLAUDE.md               # Pointer cho Claude Code → đọc AGENT_SKILL.md
└── TAGS.md                 # Taxonomy 10 tags + danh sách sách đã review
```

---

## Tùy chỉnh

Muốn thay đổi cách AI review sách? Mở `AGENT_SKILL.md`, tìm **Section 6 — Review Prompt** và chỉnh prompt theo ý bạn. Tất cả AI đọc file này sẽ tự động áp dụng.

---

## Tech stack

- Thuần **HTML/CSS/JS** — không framework, không build tool
- Font: [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) + [Be Vietnam Pro](https://fonts.google.com/specimen/Be+Vietnam+Pro)
- Deploy: **GitHub Pages** (tự động qua GitHub Actions)
- AI: bất kỳ coding agent nào có thể đọc file và chỉnh sửa code
