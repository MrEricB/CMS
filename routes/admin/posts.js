const express = require('express');
const router = express.Router();
const Post = require('../../models/Posts');


router.all("/*", (req, res, next)=>{
    req.app.locals.layout = 'admin';
    next();
});

// /admin/posts by default
router.get('/', (req, res) => {
    //pull data from database
    Post.find({}).then(posts => {
        res.render('admin/posts', {posts: posts});
    });
});

router.get('/create', (req, res) => {
    res.render('admin/posts/create');
});

router.post('/create', (req, res) => {
    let allowComments = true;
    if(!req.body.allowComments){allowComments = false}

    const newPost = new Post({
        title: req.body.title,
        status: req.body.status,
        allowComments: allowComments,
        body: req.body.body
    });

    newPost.save().then(savedPost => {
        res.redirect('/admin/posts');
        console.log(savedPost)
    }).catch(err => {
        console.log('could not save post', err);
    })



    // console.log(req.body);
});

router.get('/edit/:id', (req, res) => {
    //query the specific post and pass to res.render
    Post.findOne({_id: req.params.id}).then(post => {
        res.render('admin/posts/edit', {post: post});    
    });
    
});

//TODO: change to findAndUpdate
router.put('/edit/:id', (req, res) => {
    let allowComments = true;
    Post.findOne({_id: req.params.id})
    .then(post => {
        if(req.body.allowComments){
            allowComments = true;
        } else {
            allowComments = false;
        }

        post.title = req.body.title;
        post.status = req.body.status;
        post.allowComments = allowComments;
        post.body = req.body.body;

        post.save().then(updatedPost => {
            res.redirect('/admin/posts');
        }).catch(err => console.log('could not update', err));
    });
});

router.delete('/:id', (req, res) => {
    
    Post.remove({_id: req.params.id})
        .then(result => {
            res.redirect('/admin/posts');
        });
});

module.exports = router;