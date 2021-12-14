const express = require('express');
const app = express();
const path = require('path')
var db = require('./querry');
const bodyParser = require('body-parser');

const handlebars = require('express-handlebars');
const port = process.env.PORT||3000;

app.set('views',path.join(__dirname,'views'));
app.engine('handlebars', handlebars.engine({defaultLayout:'layout'}));
app.set('view engine','handlebars');

app.use(express.static(path.join(__dirname, 'lib')));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//home route
app.get('/',(req,res)=>{
    res.render('base');
})


app.get('/getserver',db.getserver);
app.get('/getrds_db',db.getrds_db);
app.post('/addserver',db.addserver);
app.post('/addrds_db',db.addrds_db);
app.post('/delserver',db.delserver);
app.post('/delrds_db',db.delrds_db);


app.listen(port, () =>{
    console.log("server is listening on port ",port);
})