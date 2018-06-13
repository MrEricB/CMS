const express = require('express');
const router = express.Router();
const Post = require('../../models/Posts');
const Comment = require('../../models/Comment');


router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});


router.get('/', (req, res) => {
    //populate('user') is for the table in /comments
    // user:req.user.id is who is currently logged in

    Comment.find({user: '5b19a23275038757fc6dcd4e'}).populate('user').then(comments => {
    // Comment.find({user: req.user.id}).populate('user').then(comments => {
        
        res.render('admin/comments', {comments: comments})

    });

});

//TODO: fix comments not working when user not logged in like not let user enter comments unless they are logged in
router.post('/', (req, res) => {

    Post.findOne({_id: req.body.id}).then(post => {

        const newComment = new Comment({
            user: req.user.id, // created by the session/pasport when logged in
            body: req.body.body
        });

        post.comments.push(newComment);

        post.save().then(savedPost => {
            newComment.save().then(savedComment => {
                req.flash('success_message', 'Comment was made, approval pennding');
                res.redirect(`/posts/${savedPost.id}`);
            });
        });
    });

});


router.delete('/:id', (req, res) => {
    Comment.findByIdAndRemove(req.params.id).then(deletedItem => {
        Post.findOneAndUpdate({comments: req.params.id}, {$pull: {comments: req.params.id}}, (err, data) => {
            if(err) console.log(err);

            res.redirect('/admin/comments');
        });
    });
    // Comment.remove({_id: req.params.id}).then(deletedItem => {
    //     Post.findOneAndUpdate({comments: req.params.id}, {$pull: {comments: req.params.id}}, (err, data) => {
    //         if(err) console.log(err);

    //         res.redirect('/admin/comments');
    //     });
    // });
});


router.post('/approve-comment', (req, res) => {
    Comment.findByIdAndUpdate(req.body.id, {$set: {approveComment: req.body.approveComment}}, (err, result) => {
        if(err) return err;
        res.send(result);
    });
});


module.exports = router;
