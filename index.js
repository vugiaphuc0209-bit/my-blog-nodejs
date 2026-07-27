const express = require('express');
const { engine } = require('express-handlebars');
const app = express();
const port = 3000;

// Nạp hệ thống định tuyến (Router) mới vào
const route = require('./routes');

// 1. Cấu hình Handlebars
app.engine('hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', './views');

// 2. Cấp quyền truy cập cho thư mục public
app.use(express.static('public'));

// 3. Khởi tạo các tuyến đường (Thay thế toàn bộ app.get cũ)
route(app);

// 4. Khởi động Server
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});