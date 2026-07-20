const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path'); // Thư viện định tuyến đường dẫn chuẩn xác

const app = express();
const port = 3000;

// =========================================================
// 1. CẤU HÌNH HỆ THỐNG
// =========================================================

// Định tuyến thư mục tĩnh vào 'src/public' để nhận file CSS từ SASS compile
app.use(express.static(path.join(__dirname, 'public')));

// Middleware phân tích dữ liệu từ Form gửi lên (Đã check đúng Bước 3)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Cấu hình Template Engine (Express-Handlebars)
app.engine('hbs', engine({ 
    extname: '.hbs',
    helpers: {
        // Helper định dạng ngày tháng để file home.hbs không bị lỗi crash
        dateFormat: (date, format) => {
            const d = new Date(date);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${day}-${month}-${year}`;
        },
        // Helper so sánh bằng (eq) để phục vụ cho ô chọn Dropdown <select> ở trang Tìm kiếm
        eq: (a, b) => a === b
    }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views')); // Chỉ định thư mục views nằm trong src

// Mảng dữ liệu mẫu bài viết dùng chung cho các route
let mockBlogs = [
    {
        name: "Lập trình Node.js và Express cho người mới bắt đầu",
        slug: "lap-trinh-nodejs-express",
        tag: "NodeJS",
        content: "Bài viết này sẽ hướng dẫn bạn cách xây dựng một ứng dụng web cơ bản sử dụng Express framework và xử lý giao diện với Handlebars template...",
        img: "/img/pattern.png",
        author_name: "Julia Walker",
        author_img: "/img/author.png",
        updatedAt: new Date()
    },
    {
        name: "Tối ưu hóa Core Web Vitals nâng cao hiệu suất",
        slug: "toi-uu-core-web-vitals",
        tag: "Web Performance",
        content: "Tìm hiểu các chỉ số LCP, FID, CLS là gì và cách làm thế nào để website của bạn đạt điểm tối đa trên Google PageSpeed Insights...",
        img: "/img/pattern.png",
        author_name: "Julia Walker",
        author_img: "/img/author.png",
        updatedAt: new Date()
    }
];

// Hàm bổ trợ tạo Slug tự động dựa trên tiêu đề (Ví dụ: "Học Node" -> "hoc-node")
const slugify = (text) => {
    return text.toString().toLowerCase().trim()
        .replace(/\s+/g, '-')           
        .replace(/[^\w\-]+/g, '')       
        .replace(/\-\-+/g, '-');        
};

// =========================================================
// 2. ĐỊNH TUYẾN ROUTE (Nơi xử lý yêu cầu)
// =========================================================

// --- Route 1: Trang chủ ---
app.get('/', (req, res) => {
    res.render('home', { blogs: mockBlogs });
});

// --- Route 2: Trang Giới thiệu (About) ---
app.get('/about', (req, res) => {
    res.render('about');
});

// --- Route 3: Trang Liên hệ (Contact) ---
app.get('/contact', (req, res) => {
    res.render('contact');
});

// --- Route 4: Trang Tìm kiếm (Search) ---
app.get('/search', (req, res) => {
    const query = req.query.q || '';             
    const searchType = req.query.type || 'post'; 

    console.log('\n======================================');
    console.log(`🔍 [Yêu cầu tìm kiếm nhận được]`);
    console.log(`👉 Từ khóa (q): "${query}"`);
    console.log(`👉 Tìm theo (type): "${searchType}"`);
    console.log('======================================\n');

    let filteredBlogs = [];
    if (query) {
        filteredBlogs = mockBlogs.filter(blog => {
            const searchKey = query.toLowerCase();
            if (searchType === 'author') {
                return blog.author_name.toLowerCase().includes(searchKey);
            } else {
                return blog.name.toLowerCase().includes(searchKey) || 
                       blog.content.toLowerCase().includes(searchKey);
            }
        });
    }

    res.render('search', {
        query: query,
        searchType: searchType,
        blogs: filteredBlogs
    });
});

// --- Route 5: Hiển thị trang tạo bài viết (Trỏ vào đúng thư mục con blogs/create) ---
app.get('/blogs/create', (req, res) => {
    res.render('blogs/create'); 
});

// =========================================================
// ĐÃ CẬP NHẬT THEO ĐÚNG BƯỚC 4 CỦA GIÁO TRÌNH NOTION
// =========================================================
app.post('/blogs/store', (req, res) => {
    // 1. Toàn bộ dữ liệu ẩn nằm trong đối tượng req.body
    console.log("Dữ liệu nhận được từ Form:", req.body);

    // Xử lý phụ: Thêm dữ liệu vào mảng tạm thời (để giữ logic bài viết không bị mất)
    const { name, content, tag, img, author_img, author_name } = req.body;
    const newBlog = {
        name,
        slug: slugify(name || ''), 
        tag,
        content,
        img: img || '/img/pattern.png', 
        author_name,
        author_img: author_img || '/img/author.png', 
        updatedAt: new Date()
    };
    mockBlogs.unshift(newBlog); 

    // 2. Tạm thời trả về data dưới dạng JSON lên màn hình trình duyệt theo đúng giáo trình
    res.json(req.body);
});

// =========================================================
// 3. KHỞI CHẠY MÁY CHỦ
// =========================================================
app.listen(port, () => {
    console.log(`\n🚀 Server đang chạy thành công tại: http://localhost:${port}`);
    
    console.log('\n======================================');
    console.log('📋 CHECK ROUTE TRÊN HỆ THỐNG:');
    
    if (app._router && app._router.stack) {
        app._router.stack.forEach((r) => {
            if (r.route) {
                const method = Object.keys(r.route.methods)[0].toUpperCase();
                console.log(`   [${method}]  http://localhost:${port}${r.route.path}`);
            }
        });
    }
    
    console.log('======================================\n');
});