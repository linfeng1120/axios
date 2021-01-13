var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//引入jwt 携带token token的加解密
var jwt = require('jsonwebtoken')

//引入工具
require(process.cwd() + '/common/db.js');
require(process.cwd() + '/common/utils.js');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
//node端
// let cors = require('cors');







// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//设置跨域的
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "http://127.0.0.1:5500"); //必须写上自己的域名,不能为*
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');//允许携带cookie
  if (req.method == 'OPTIONS') {
    res.send(200);
  }
  else {
    next();
  }
});
// app.use(cors({
//   //允许所有前端域名
//   "origin": ["http://localhost:8001", "http://localhost:5500", "http://localhost:8848"],
//   "credentials": true,//允许携带凭证
//   "methods": "GET,HEAD,PUT,PATCH,POST,DELETE", //被允许的提交方式
//   "allowedHeaders": ['Content-Type', 'Authorization']//被允许的post方式的请求头
// }));



//除了登录注册,其他接口都需要验证token
// app.use('/', (req,res,next) => { // 请求地址是/ 可以省略不写
app.use((req, res, next) => { // next是express app对象方法的形参
  // 登录注册接口直接跳过(放行)
  if (req.url == "/users"
    || req.url == "/users/login"
    || req.url == "/users/reg"
    || req.url == "/users/captcha") {
    //在express中只要第一个路由匹配了，就不会走下一个路由
    //通过next语法可以继续向下匹配其他路由
    next()
  } else {
    //接收token
    let token = req.query.token || req.body.token || req.headers["authorization"];
    //校验token 盐值要保持一致
    jwt.verify(token, 'gaoxing', (err, decode) => {//decode是之前存的对象信息
      if (err) return sendJson(res, 400, 'token参数有误');
      req.name = decode.name  //将数据存到req对象中（后面路由的req都想都会有这个uid属性）
      console.log(`解密成功，用户名${decode.name}并已保存到req对象中`)
      console.log(decode) // 对象，里面是之前存的信息
      //验证成功放行
      next();
    })
  }
});

// app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
