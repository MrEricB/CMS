const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');


app.use(express.static(path.join(__dirname, 'public')));

//set view engine 'handlebars'
app.engine('handlebars', exphbs({defaultLayout: 'home'}));
app.set('view engine', 'handlebars');


//load routes
const home = require('./routes/home/index');
const admin = require('./routes/admin/index');

//use routes
app.use('/', home);
app.use('/admin', admin);


const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server up on PORT: ${PORT}`);
});