//引入配置文件
let dbConfig = require(process.cwd() + '/common/config.json').db_config;

//引入mongo
let mongo = require('mongoose');

//连接数据库
let db = mongo.createConnection(`mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.dbname}`,
  { useNewUrlParser: true, useUnifiedTopology: true }, err => {
    if (err) {
      console.log('db err....' + err);
    }
    console.log('db success....');
  }
)



//配置到全局变量

global.db = db;