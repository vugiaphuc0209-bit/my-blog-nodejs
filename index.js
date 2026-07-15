const express = require('express');
const { engine } = require('express-handlebars'); // Đưa require lên đầu trang cho sạch sẽ
const app = express();
const port = 3000;

// 1. Cấu hình Handlebars (Phải đặt TRƯỚC các route app.get)
app.engine('hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', './views'); // Chỉ định thư mục chứa giao diện

// 2. Cấp quyền truy cập cho thư mục public (CSS, hình ảnh, js client)
app.use(express.static('public'));

// 3. Định nghĩa các Routes
app.get('/', (req, res) => {
  res.render('home'); // Lúc này Express đã biết tìm file 'home.hbs' trong thư mục './views'
});

// Route xử lý cho trang About
app.get('/about', (req, res) => {
  res.render('about');
});

// Route xử lý cho trang Liên hệ
app.get('/contact', (req, res) => {
  res.render('contact');
});

// Route hiển thị trang Tìm kiếm
app.get('/search', (req, res) => {
  // req.query chứa toàn bộ các parameters trên URL
  console.log("Từ khóa tìm kiếm:", req.query.q);

  res.render('search');
});

// 4. Khởi động Server
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});