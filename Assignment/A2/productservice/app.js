var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var monk = require('monk');
var db = monk('127.0.0.1:27017/assignment2');

var productRouter = require('./routes/product');

var app = express();
//app.use(cors());
app.use(cookieParser());
// view engine setup
var corsOptions = {
  "origin": "http://localhost:3000",
  "credentials": true
}

app.use(function(req,res,next){
  console.log(req.method); 
  next();
});

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
  req.db = db; 
  next();
});


app.use('/', productRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var server = app.listen(3001, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log("Lab 8 server listening at http://%s:%s", host, port);
})
