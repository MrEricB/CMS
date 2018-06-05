const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');


/**** Database stuff ****/
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1/cms').then( db => {
    console.log('connected to mongodb')
}).catch(err => console.log('could not connect to DB: ', err));


//serve static files i.e. css.
app.use(express.static(path.join(__dirname, 'public')));

//helper functions for handlebars
const {select} = require('./helpers/handlebars-helpers');

//set view engine 'handlebars'
app.engine('handlebars', exphbs({defaultLayout: 'home', helpers: {select: select}}));
app.set('view engine', 'handlebars');


//file upload middleware
app.use(upload());

//body-parse middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//midware to use method verbs
app.use(methodOverride('_method'));

//load routes
const home   = require('./routes/home/index');
const admin  = require('./routes/admin/index');
const posts  = require('./routes/admin/posts');

//use routes
app.use('/', home);
app.use('/admin', admin);
app.use('/admin/posts', posts);


const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server up on PORT: ${PORT}`);
});