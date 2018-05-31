const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');


app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', exphbs({defaultLayout: 'home'}));
app.set('view engine', 'handlebars');

const main = require('./routes/home/main');

app.use('/', main);


const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server up on PORT: ${PORT}`);
});