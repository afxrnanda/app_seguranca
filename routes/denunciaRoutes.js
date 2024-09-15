const express = require('express');
const router = express.Router();
const Denuncia = require('../models/mysql/denuncias');
const Arquivo = require('../models/mongodb/Arquivos');

// Rota para criar uma denúncia
router.post('/denuncias', (req, res) => {
  const { title, description, userId, arquivos } = req.body;

  Denuncia.create({ title, description, userId }, (err, denunciaResult) => {
    if (err) return res.status(500).send('Erro ao criar denúncia');

    // Armazenar os arquivos relacionados no MongoDB
    arquivos.forEach((arquivo) => {
      const newArquivo = new Arquivo({
        denunciaId: denunciaResult.insertId,
        fileType: arquivo.fileType,
        filePath: arquivo.filePath
      });

      newArquivo.save()
        .then(() => console.log('Arquivo salvo no MongoDB'))
        .catch((err) => console.error('Erro ao salvar arquivo:', err));
    });

    res.status(201).send('Denúncia criada com sucesso');
  });
});

module.exports = router;
