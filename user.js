const mysql = require('mysql2');
const md5 = require('blueimp-md5')

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'yangfang@yc1987',
  database: 'user'
});

connection.connect();

/**
 *  save account
 */
exports.save = function (user) {
  user.user_password = md5(user.user_password)
  return new Promise((resolve,reject)=>{
    connection.query(`INSERT INTO USERS (user_name,user_account,user_password) value ('${user.user_name}','${user.user_account}','${user.user_password}')`, function (err, res, fields) {
      if (err) {
        // 发生错误的时候执行reject
        reject(err)
      }else {
        resolve(res)
      }
    });
  })
}

/**
 *  find account
 */
exports.findOne = function (user) {
  const where = []
  
  if(user.user_account){
    where.push(` and user_account = '${user.user_account}'`)
  }
  return new Promise((resolve,reject)=>{
    connection.query(`SELECT * FROM USERS WHERE 1 = 1 ${where.join('')}`, function (err, res, fields) {
      if (err) {
        // 发生错误的时候执行reject
        reject(err)
      }else {
        resolve(res)
      }
    });
  })
}
