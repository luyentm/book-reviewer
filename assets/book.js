// book.js — chạy trên các trang review chi tiết
// Tự động set href cho tag-link dựa vào text content
// → tránh phải hardcode URL encode tiếng Việt trong HTML

document.querySelectorAll('a.tag-link').forEach(function (a) {
  var tag = a.textContent.trim();
  if (tag) a.href = '../index.html#tag=' + encodeURIComponent(tag);
});
