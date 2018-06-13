const express = require('express');
const router = express.Router();
const Post = require('../../models/Posts');
const Comment = require('../../models/Comment');
const faker = require('faker');
const {userAuthenticated} = require('../../helpers/authentication');


//override default layout set in app.js i.e. the home layout
//TODO: add useAuthenitcted to all admin routes
router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'admin';
    next();
});


//don't need '/admin' because of midleware app.use('/admin', ...) is already telling it to add /admin
//this is going into views/admin/index.handlebars
router.get('/', (req, res) => {
    Post.count().then(postCount => {
        Comment.count().then(commentCount => {
            Comment.count({user: req.user}).then(userCommentCount => { //userComment not working fix this
                res.render('admin/index', {postCount: postCount, commentCount: commentCount, userCommentCount: userCommentCount});
            });
        });
    });
});

//TEMPARARY ROUTE to generate fake data for testing
router.post('/generate-fake-posts', (req, res) => {
    
    // res.send('itworks');
    for(let i = 0; i < req.body.amount; i++){

        let post = new Post();

        post.title = faker.random.word();
        post.status = 'public';
        post.allowComments = faker.random.boolean();
        post.body = faker.lorem.paragraph();
        post.slug = faker.random.word();

        post.save().then(newPost => {
        });
    }

    res.redirect('/admin/posts');

});


module.exports = router;