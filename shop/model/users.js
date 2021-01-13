/********用户列表*********/


//定义模型
const model = db.model('users', {
  name: { type: String },
  pwd: { type: String },
  age: { type: Number }
})

//用户列表方法 查询所有数据
//find得到的数据是数组
const usersModelList = (where = {}) => {
  return model.find(where)
    .then(re => {
      return re;
    })
    .catch(err => {
      console.log('请求失败' + err);
      return false;
    })
}


//查询单条数据
const userModelOne = (data) => {
  return model.findOne(data)
    .then(re => {
      return re;
    })
    .catch(err => {
      console.log('请求失败' + err);
      return false;
    })
}

//插入数据的方法
const usersModelInsert = (data) => {
  let insertObj = new model(data);
  return insertObj.save()
    .then(re => {
      return re;
    })
    .catch(err => {
      console.log('插入失败....' + err);
      return false;
    })
}

//导出
module.exports = {
  usersModelList,

  userModelOne,
  usersModelInsert
}