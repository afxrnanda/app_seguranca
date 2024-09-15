const mysqlConnection = require('../../mysql');

class Usuario {
  static create(usuario, callback) {
    const query = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
    mysqlConnection.query(query, [usuario.nome, usuario.email, usuario.senha], callback);
  }

  static findByUsername(username, callback) {
    const query = 'SELECT * FROM usuarios WHERE usuario = ?';
    mysqlConnection.query(query, [username], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  }
}

module.exports = Usuario;