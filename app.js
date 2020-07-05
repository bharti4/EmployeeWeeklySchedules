var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const initDb =  require("./DB_Authorization_Model/db").initDb;

var helpers = require('handlebars-helpers');
var comparison = helpers.comparison();


const app = express();
//setting veiw engine - handlebars
app.engine('handlebars',exphbs({defaultLayout:'main'}));
app.set('view engine','handlebars');

// static path resources
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

port=3000;
app.use('/users',require('./routes/users'));
app.use('/schedule',require('./routes/schedule'));
app.use('/', require('./routes/index'));

initDb().then(db=>{
    global.db = db;
    app.listen(process.env.PORT || 3000, function (err) {
    if (err) {
        throw err; //
    }
    console.log("Schudule App running on port " + port);
        })
 }).catch(error=>{throw error;})

//to handle 404 error
app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")

 })
  
//to handle error  http 500
app.use(function (err, req, res, next) {
    msg = "Schedule Internal Server Error";
    res.status(500).render('Error',{title:"Error", message:{"msg":msg+err},messageClass:"alert" });

})
  

