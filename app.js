const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const { mongoDBUrl } = require('./config/database');


/**** Database stuff ****/
mongoose.Promise = global.Promise;
mongoose.connect(mongoDBUrl).then( db => {
    console.log('connected to mongodb')
}).catch(err => console.log('could not connect to DB: ', err));


//serve static files i.e. css.
app.use(express.static(path.join(__dirname, 'public')));

//helper functions for handlebars
const {select, generateDate} = require('./helpers/handlebars-helpers');

//set view engine 'handlebars'
app.engine('handlebars', exphbs({defaultLayout: 'home', helpers: {select: select, generateDate: generateDate}}));
app.set('view engine', 'handlebars');


//file upload middleware
app.use(upload());

//body-parse middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//midware to use method verbs
app.use(methodOverride('_method'));


//session middleware
app.use(session({
    secret: 'eric123abc',
    resave: true,
    saveUninitialized: true
}));
//flash-connect middleware
app.use(flash());
//passport login middleware
app.use(passport.initialize());
app.use(passport.session());



//local variables using middileware
app.use((req,res, next) => {
    res.locals.success_message = req.flash('success_message');
    // res.locals.form_errors = req.flash('form_errors');
    res.locals.error_message = req.flash('error_message');
    res.locals.user = req.user || null; //help to handle user is logged in.
    res.locals.error = req.flash('error');
    next();
});


//load routes
const home   = require('./routes/home/index');
const admin  = require('./routes/admin/index');
const posts  = require('./routes/admin/posts');
const categories  = require('./routes/admin/categories');


//use routes
app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);
app.use('/admin/categories', categories);



const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server up on PORT: ${PORT}`);
});