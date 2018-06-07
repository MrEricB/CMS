const express = require('express');
const router = express.Router();
const Post = require('../../models/Posts');
const Category = require('../../models/Category');



router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'home';
    next();
});

//these are going into views/home/*.handlebars
router.get('/', (req, res) => {

    //get all the post
    Post.find({}).then(posts => {
    
        Category.find({}).then(categories => {
            res.render('home/index', {posts: posts, categories: categories});
        });
        
    });

});

router.get('/about', (req, res) => {
    res.render('home/about');
});

router.get('/login', (req, res) => {
    res.render('home/login');
});

router.get('/register', (req, res) => {
    res.render('home/register');
});

router.get('/posts/:id', (req, res) => {
    Post.findOne({_id: req.params.id}).then( post => {
        Category.find({}).then(categories => {
            res.render('home/post', {post: post, categories: categories});
        });
    });
});


module.exports = router;