const express = require('express');
const router = express.Router();
const siteController = require('../app/controllers/SiteController');

// Chú ý: Route gốc '/' luôn phải nằm dưới cùng
router.get('/search', siteController.search);
router.get('/about', siteController.about);
router.get('/contact', siteController.contact);
router.get('/', siteController.index);

module.exports = router;