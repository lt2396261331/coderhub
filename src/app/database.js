const mysql = require('mysql2')
const {
  MYSQL_HOST,
  MYSQL_PROT,
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD
} = require('./config')


const connections = mysql.createPool({
  host: MYSQL_HOST,
  port: MYSQL_PROT,
  database: MYSQL_DATABASE,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD
})

connections.getConnection((err, conn) => {
  conn.connect(err => {
    if (err) {
      console.log('连接失败', err)
      return
    }
    console.log('连接成功~')
  })
})


module.exports = connections.promise()
