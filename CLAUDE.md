# Book Reviewer — Hướng dẫn cho Claude

Đây là repo review sách cá nhân. Khi user yêu cầu review một cuốn sách, hãy làm theo đúng quy trình bên dưới.

---

## QUYTRÌNH KHI REVIEW SÁCH MỚI

**Trigger:** User nói `Review sách: [Tên sách] - [Tác giả]`

### Bước 1 — Tạo slug
Chuyển tên sách thành slug (lowercase, không dấu, kebab-case):
- "Nhà Giả Kim" → `nha-gia-kim`
- "Đắc Nhân Tâm" → `dac-nhan-tam`
- "Sapiens: Lược Sử Loài Người" → `sapiens-luoc-su-loai-nguoi`
- Bỏ dấu câu đặc biệt, chỉ giữ chữ và số, nối bằng `-`

### Bước 2 — Sinh file `books/[slug].html`
Tạo file HTML đầy đủ theo **BOOK PAGE TEMPLATE** bên dưới.
Nội dung review dựa theo **REVIEW PROMPT** bên dưới.

### Bước 3 — Cập nhật `index.html`
Tìm comment `<!-- BOOK CARDS -->` trong `index.html` và thêm card mới **vào đầu** danh sách (sách mới nhất hiện trước):

```html
<a href="books/[slug].html" class="book-card" data-tags="[TAG1],[TAG2]">
  <div class="book-cover" style="background: [CHỌN 1 MÀU VINTAGE TỪ PALETTE BÊN DƯỚI]">
    <span class="book-spine"></span>
  </div>
  <div class="book-info">
    <h2 class="book-title">[Tên sách]</h2>
    <p class="book-author">[Tên tác giả]</p>
    <div class="card-tags">
      <span class="card-tag" data-tag="[TAG1]">[TAG1]</span>
      <!-- thêm span cho mỗi tag chủ đề, không thêm "Phi hư cấu" hay năm -->
    </div>
    <p class="book-excerpt">[2-3 câu mô tả ngắn, hấp dẫn về cuốn sách]</p>
    <span class="read-more">Đọc review →</span>
  </div>
</a>
```

**Lưu ý về tags:** `data-tags` chỉ chứa tag chủ đề (ví dụ: `Tài chính cá nhân,Kinh doanh & Lãnh đạo`), không bao gồm "Phi hư cấu" hay năm xuất bản. Filter bar trên index.html được tự động tạo từ các tag này bởi JavaScript.

**Palette màu vintage cho bìa sách** (chọn luân phiên, tránh trùng với card liền kề):
- `#8B4513` (nâu saddle)
- `#2F4F4F` (xanh teal tối)
- `#556B2F` (xanh olive)
- `#8B0000` (đỏ đậm)
- `#4B3832` (nâu cappuccino)
- `#1C3A4A` (xanh navy tối)
- `#5C4033` (nâu mocha)
- `#3B5323` (xanh rừng)

---

## REVIEW PROMPT

> **Ghi chú:** Đây là phần quan trọng nhất. User sẽ cung cấp prompt chi tiết và điền vào đây.
> Hiện tại dùng prompt mặc định bên dưới cho đến khi có prompt riêng.

**[PROMPT MẶC ĐỊNH — SẼ ĐƯỢC THAY THẾ BỞI PROMPT RIÊNG CỦA USER]**

"Hãy đóng vai một chuyên gia tóm tắt sách và một nhà huấn luyện tư duy. Tôi muốn lĩnh hội cuốn sách [Tên Sách] của tác giả [Tên Tác Giả] trong vòng 5 phút đọc. Hãy tóm tắt theo cấu trúc sau để tôi không bỏ lỡ giá trị cốt lõi:

1. Thông điệp 'Hạt nhân' (Core Message): Viết duy nhất 1 câu tóm tắt tư tưởng lớn nhất mà cuốn sách muốn truyền tải.

2. 5 Nguyên tắc vàng (Big Ideas): Liệt kê 5 bài học/tư duy quan trọng nhất. Với mỗi mục, hãy giải thích: Nó là gì? Tại sao nó quan trọng? và Áp dụng vào thực tế như thế nào?

3. Thay đổi thế giới quan: Những quan niệm sai lầm nào mà cuốn sách này sẽ giúp tôi gỡ bỏ? (So sánh Trước và Sau khi đọc).

4. Kế hoạch hành động 1 phút: Nếu tôi chỉ có thể làm 3 việc ngay hôm nay sau khi đọc tóm tắt này để thay đổi cuộc sống, đó là gì?

5. Câu trích dẫn 'đắt' nhất: Một câu trích dẫn tóm gọn tinh thần của cả cuốn sách.

**Lưu ý về thể loại:** Nếu đây là tiểu thuyết hoặc sách hư cấu (fiction), hãy thay phần 4 (Kế hoạch hành động) bằng: Nhân vật hoặc tình huống nào trong sách khiến người đọc suy nghĩ lâu nhất, và tại sao nó có sức nặng như vậy?"

---

## BOOK PAGE TEMPLATE

Khi tạo `books/[slug].html`, dùng cấu trúc HTML sau (điền nội dung thực vào các placeholder):

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Tên sách] — Book Review</title>
  <link rel="stylesheet" href="../assets/style.css">
</head>
<body class="book-page">
  <header class="site-header">
    <a href="../index.html" class="back-link">← Tủ sách</a>
  </header>

  <main class="book-detail">
    <div class="book-hero">
      <div class="hero-cover" style="background: [MÀU VINTAGE GIỐNG VỚI CARD]">
        <span class="book-spine"></span>
      </div>
      <div class="hero-meta">
        <h1 class="hero-title">[Tên sách]</h1>
        <p class="hero-author">— [Tên tác giả]</p>
        <div class="hero-tags">
          <!-- Tag chủ đề: dùng <a> với link về index + hash filter -->
          <a href="../index.html#tag=[TAG_ENCODED]" class="tag tag-link">[Thể loại]</a>
          <!-- Tag meta: dùng <span> thường -->
          <span class="tag">Phi hư cấu</span>
          <span class="tag">[Năm xuất bản nếu biết]</span>
        </div>
      </div>
    </div>

    <article class="review-body">
      <!-- NỘI DUNG REVIEW VIẾT THEO REVIEW PROMPT Ở TRÊN -->
      <!-- Dùng thẻ <h2> cho các phần chính, <p> cho đoạn văn, <blockquote> cho trích dẫn -->

      [NỘI DUNG REVIEW ĐẦY ĐỦ]

    </article>
  </main>

  <footer class="site-footer">
    <p>✦ Tủ sách cá nhân ✦</p>
  </footer>
</body>
</html>
```

---

## LƯU Ý

- Luôn dùng tiếng Việt cho toàn bộ nội dung
- File sách lưu tại `books/[slug].html`, không phải thư mục gốc
- Không cần thêm bất kỳ dependency hay build tool nào — thuần HTML/CSS
- Sau khi tạo xong, thông báo cho user biết đã tạo file nào và cập nhật index.html
