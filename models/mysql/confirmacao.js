const mysqlConnection = require('../../mysql');

class Confirmacao {
  static create({ denuncia_id, usuario_id, confirmacao_tipo }, callback) {
    const query = `
      INSERT INTO confirmacao_denuncias (denuncia_id, usuario_id, confirmacao_tipo)
      VALUES (?, ?, ?)
      ON CONFLICT (denuncia_id, usuario_id) DO NOTHING  -- Evitar duplicidade
    `;
    mysqlConnection.query(query, [denuncia_id, usuario_id, confirmacao_tipo], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }

  static findByDenunciaId(denuncia_id, callback) {
    const query = 'SELECT * FROM confirmacao_denuncias WHERE denuncia_id = ?';
    mysqlConnection.query(query, [denuncia_id], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }
}

module.exports = Confirmacao;
