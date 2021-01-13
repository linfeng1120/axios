var express = require('express');
var router = express.Router();
let session = require('express-session');
let svgCaptcha = require('svg-captcha');

let { userConList, userConLogin, userConRegister } = require(process.cwd() + '/controller/users.js')

//配置 手册中使用app.use,但是router中也有use方法
router.use(session({
  secret: 'gaoxing',	// 加密存储（加盐）
  // resave是指每次请求都重新设置session cookie，
  // 假设你的cookie是10分钟过期，每次请求都会再设置10分钟
  resave: false,
  saveUninitialized: true,   // 初始化session存储
  cookie: { maxAge: 60000 }	// 过期时间/毫秒  1分钟=60秒=1000*60  
}));

/* GET users listing. */
//列表
router.get('/', userConList);

//登录
router.post('/login', userConLogin);

//注册
router.post('/reg', userConRegister);

//验证码路由
router.get('/captcha', function (req, res) {
  var captcha = svgCaptcha.create();
  // 将验证码的数字保存到session中
  req.session.captcha = captcha.text;
  // res.type('svg');
  res.status(200).send(captcha.data);
})

module.exports = router;
