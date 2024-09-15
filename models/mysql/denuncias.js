const mysqlConnection = require('../../mysql');

class Denuncia {
  static create({ usuario_id, titulo, description, location }, callback) {
    const query = `
      INSERT INTO denuncias (usuario_id, titulo, description, location)
      VALUES (?, ?, ?, ST_SetSRID(ST_MakePoint(?, ?), 4326))  -- Location é um ponto GEOGRAPHY
    `;
    mysqlConnection.query(query, [usuario_id, titulo, description, location.longitude, location.latitude], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }

  static findById(denuncia_id, callback) {
    const query = 'SELECT * FROM denuncias WHERE denuncia_id = ?';
    mysqlConnection.query(query, [denuncia_id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
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
