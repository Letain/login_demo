const mysql = require('mysql2');
const md5 = require('blueimp-md5')

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '12345678',
  database: 'stj'
});

connection.connect();

/**
 *  save account
 */
exports.save = function (user) {
  user.password = md5(user.password)
  return new Promise((resolve,reject)=>{
    connection.query(`insert into users (name,account,password,role_id,lock_status,login_status,birth,email,address,phone,create_datetime,update_datetime) value ('${user.name}','${user.account}','${user.password}','${user.role_id}',0,0,'${user.birth}','${user.email}','${user.address}','${user.phone}',now(),now())`, function (err, res, fields) {
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
    where.push(` and account = '${user.user_account}'`)
  }
  return new Promise((resolve,reject)=>{
    connection.query(`select * from users where 1 = 1 ${where.join('')}`, function (err, res, fields) {
      if (err) {
        // 发生错误的时候执行reject
        reject(err)
      }else {
        resolve(res)
      }
    });
  })
}
