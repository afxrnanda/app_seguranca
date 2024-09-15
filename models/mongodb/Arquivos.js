const mongoose = require('../../mongodb');

const ArquivoSchema = new mongoose.Schema({
  denunciaId: { type: String, required: true },
  fileType: { type: String, required: true },
  filePath: { type: String, required: true }
});

module.exports = mongoose.model('Arquivo', ArquivoSchema);
