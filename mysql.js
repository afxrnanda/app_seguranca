const mysql = require('mysql2');

const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'backend.ifrn.cn',
    database: 'usuarios'
})

mysqlConnection.connect(err => {
    if (err) {
      console.error('Erro ao conectar ao banco de dados:', err);
      return;
    }
    console.log('Conectado ao banco de dados MySQL.');
  });
  
  module.exports = mysqlConnection;