class SiteController{
    // [GET] / (Trang chủ)
    index(req, res) {
        res.render('home');
    }

    // [GET] /about
    about(req, res) {
        res.render('about');
    }

    // [GET] /contact
    contact(req, res) {
        res.render('contact');
    }

    // [GET] /search
    search(req, res) {
        console.log("Từ khóa tìm kiếm:", req.query.q);
        res.render('search');
    }
}

// Xuất đối tượng ra để sử dụng ở file Route
module.exports = new SiteController();