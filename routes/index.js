const siteRouter = require('./site');

function route(app){
    // Mọi luồng truy cập cơ bản sẽ được đẩy sang cho siteRouter xử lý
    app.use('/', siteRouter);
}

module.exports = route;