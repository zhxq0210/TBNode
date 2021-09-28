var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
//加载路由模块
var classModule = require('./routes/class');
var product = require('./routes/product');
var cart = require('./routes/cart');
var user = require('./routes/user');
var order = require('./routes/order');
var shop = require('./routes/shop');
var address = require('./routes/address');
var admin = require('./routes/admin')
var app = express();

//中间件 
app.all("*",function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*"); //允许所有访问者跨域请求
  next() //传递
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//使用 session插件
app.use(session({
  secret:"112123",
  name:"user",
  cookie:{maxAge:1000*60*30},
  resave:true,
  saveUninitialized:true
}))


app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/class', classModule);
app.use('/api/product', product);
app.use('/api/cart', cart);
app.use('/api/user', user);
app.use('/api/order', order);
app.use('/api/shop', shop);
app.use('/api/address', address);
app.use('/api/admin',admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
