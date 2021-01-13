//引入
let { usersModelList, userModelOne, usersModelInsert } = require(process.cwd() + '/model/users.js');

//引入
//加密
let bcrypt = require('bcrypt');
//token加密方式
let jwt = require('jsonwebtoken');


/*******实现用户列表*******/
const userConList = async (req, res) => {
  let data = await usersModelList();
  // console.log(data);
  sendJson(res, 200, '用户列表获取成功', data);
}


/**********用户登录***************/
const userConLogin = async (req, res) => {
  //获取客户端携带参数
  let params = req.body;
  //判断验证码
  if (!params.captcha) {
    sendJson(res, 400, '验证码为空...');
    return;
  }
  //存在验证码  比对
  // 验证码的获取,因为没有sessionid,就拿不到对应的数据
  console.log(req.session.captcha + '产生的');
  console.log(params.captcha + 'shurude');
  // 比对验证码
  if (req.session.captcha.toLowerCase() != params.captcha.toLowerCase()) {
    sendJson(res, 400, '验证码错误...');
    return;
  }
  //判断 参数是否为空
  if (!params.name || !params.pwd) {
    sendJson(res, 400, '参数存在空值');
    return;
  }
  //查询的data的数据是数组形式
  let data = await usersModelList({ name: params.name });

  //解密 
  let pass = bcrypt.compareSync(params.pwd, data[0].pwd);
  //console.log(pass);//true或者flase
  // console.log(data[0]);
  //判断
  if (!data[0] || !pass) { sendJson(res, 400, '用户名或者密码不存在'); return; }

  //携带token  jwt加密
  var token = jwt.sign({ name: data[0].name, age: data[0].age }, 'gaoxing');
  // console.log(token);

  //正常情况
  // 返回token当做登录的标识
  // 返回name显示到网站顶部
  sendJson(res, 200, '登录成功', {
    token: token,
    name: data[0].name
  });
}


/************用户注册***************/
const userConRegister = async (req, res) => {
  //接收客服端post请求携带的参数
  let params = req.body;
  //判断用户是否输入全部参数
  if (!params.name || !params.pwd || !params.age) { sendJson(res, 400, '用户名或者密码为空'); return }
  //console.log(params);
  let data = await userModelOne({ name: params.name });
  if (data) {
    sendJson(res, 400, '用户名存在');
    return;
  }
  //不存在则注册(数据库插入数据)
  //加密
  params.pwd = bcrypt.hashSync(params.pwd, 8);
  let datas = await usersModelInsert(params);
  if (datas) {
    sendJson(res, 201, '注册成功', params);
    return
  } else {
    sendJson(res, 500, '内部错误', {});
  }
}





//导出
module.exports = {
  userConList,
  userConLogin,
  userConRegister
}