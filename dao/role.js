const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '12345678',
  database: 'stj'
});

connection.connect();

/**
 *  find roles
 */
exports.findAll = async function () {
  return await new Promise((resolve,reject)=>{
    connection.query(`select * from roles`, function (err, res, fields) {
      if (err) {
        // 发生错误的时候执行reject
        reject(err)
      }else {
        resolve(res)
      }
    });
  })
}
