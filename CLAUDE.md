# Book Reviewer — Hướng dẫn cho Claude

Đây là repo review sách cá nhân.

**Toàn bộ quy trình, templates, scripts và examples nằm trong [`AGENT_SKILL.md`](AGENT_SKILL.md).**
Khi cần review sách, hãy đọc file đó và thực hiện theo 7-step execution plan trong đó.

**Trigger:** User nói `Review sách: [Tên sách] - [Tác giả]`
→ Đọc `AGENT_SKILL.md` → thực hiện đủ 7 bước

**Lưu ý nhanh:**
- Luôn dùng tiếng Việt cho toàn bộ nội dung
- File sách lưu tại `books/[slug].html`, không phải thư mục gốc
- Thuần HTML/CSS — không cần dependency hay build tool
- Thông báo cho user sau khi hoàn thành: file nào đã tạo, index.html đã cập nhật
