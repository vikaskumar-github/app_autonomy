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


app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

//home route
app.get('/',(req,res)=>{
    res.render('base');
})
app.get('/addServer' ,(req,res) =>{
  res.render('addServer');
})
app.get('/addDatabase' ,(req,res) =>{
  res.render('addDatabase');
})
app.get('/orders' ,(req,res) =>{
  res.render('showOrders');
})
app.get('/getorders',db.getorders);
app.post('/addorders',db.addorders);
app.post('/delorders',db.delorders);


app.listen(port, () =>{
    console.log("server is listening on port ",port);
})