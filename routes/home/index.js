const express = require('express');
const router = express.Router();
const Post = require('../../models/Posts');
const Category = require('../../models/Category');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;



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


// APP LOGIN

passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done)=>{

    User.findOne({email: email}).then(user=>{

        if(!user) return done(null, false, {message: 'Incorrect password and/or email'});

        bcrypt.compare(password, user.password, (err, matched)=>{

            if(err) return err;


            if(matched){

                return done(null, user);

            } else {

                return done(null, false, { message: 'Incorrect password and/or email' });

            }

        });

    });

}));


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});



router.post('/login', (req, res, next)=>{


    passport.authenticate('local', {

        successRedirect: '/admin',
        failureRedirect: '/login',
        failureFlash: true

    })(req, res, next);

});


router.get('/logout', (req,res) => {
    req.logout();
    res.redirect('/login');

});


router.get('/register', (req, res) => {
    res.render('home/register');
});


//API: register user
router.post('/register', (req, res) => {
    //TODO: add real server side form validation
    let errors = [];
    if(req.body.password !== req.body.passwordConfirm){
        errors.push({message: "Password fields must match"});
    }

    if(errors.length > 0){
        res.render('home/register', {
            errors: errors,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email
        })
    } else {

        User.findOne({email: req.body.email}).then(user => {
            if(!user){
                const newUser = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password
                });
        
                bcrypt.genSalt(10,(err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash)=>{
                        newUser.password = hash;
                        newUser.save().then(savedUser => {
                            req.flash('success_message', 'You have been successfully registered, please login'); //remember flash is midleware in app.js, as res.locals.success_message
                            res.redirect("/login");
                        });
                    });
                });    

            } else{
                req.flash('error_message', 'Email already exist, please use a different email');
                res.redirect('/login');
            }
        });

    }
    

});


// API: display individual blog post
router.get('/posts/:id', (req, res) => {
    Post.findOne({_id: req.params.id})
    .populate({path: 'comments', match:{approveComment: true}, populate: {path: 'user', model: 'users'}})
    .populate('user')
    .then( post => {

        // console.log(post);

        Category.find({}).then(categories => {
            res.render('home/post', {post: post, categories: categories});
        });
    });
});


module.exports = router;