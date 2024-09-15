const mysqlConnection = require('../../mysql');

class Denuncia {
  static create({ usuario_id, titulo, descricao, longitude, latitude }, callback) {
    const query = `
      INSERT INTO denuncias (usuario_id, titulo, descricao, longitude, latitude)
      VALUES (?, ?, ?, ?, ?)
    `;
    mysqlConnection.query(query, [usuario_id, titulo, descricao, longitude, latitude], (err, results) => {
      console.log(err);

      if (err) return callback(err);
      callback(null, results);
    });
  }

  static findById(denuncia_id, callback) {
    const query = 'SELECT * FROM denuncias WHERE id = ?';
    mysqlConnection.query(query, [denuncia_id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    }); 
  }

  static findAll(callback) {
    const query = 'SELECT * FROM denuncias';

    mysqlConnection.query(query, [], (err, results) => {
      if (err) return callback(err);
      callback(null, results)
    })
  }

  static updateMediaReference(denuncia_id, media_reference_id, callback) {
    const query = `
      UPDATE denuncias SET media_reference_id = ? WHERE denuncia_id = ?
    `;
    mysqlConnection.query(query, [media_reference_id, denuncia_id], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }
}

module.exports = Denuncia;
