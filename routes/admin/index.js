const express = require('express');
const router = express.Router();


//override default layout set in app.js i.e. the home layout
router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'admin';
    next();
});


//don't need '/admin' because of midleware app.use('/admin', ...) is already telling it to add /admin
//this is going into views/admin/index.handlebars
router.get('/', (req, res) => {
    res.render('admin/index');
});

//this is going into views/admin/dashboard.handlebars
router.get('/dashboard', (req, res) => {
    res.render('admin/dashboard');
});

module.exports = router;