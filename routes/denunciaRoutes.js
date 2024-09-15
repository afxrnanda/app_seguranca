const express = require('express');
const router = express.Router();
const Denuncia = require('../models/mysql/denuncias');
// const Arquivo = require('../models/mongodb/Arquivos');

// Rota para criar uma denúncia
router.post('/denuncias', (req, res) => {
  const { usuario_id, titulo, descricao, longitude, latitude  } = req.body;

  Denuncia.create({ usuario_id, titulo, descricao, longitude, latitude }, (err, denunciaResult) => {
    if (err) return res.status(500).send('Erro ao criar denúncia');

    // Armazenar os arquivos relacionados no MongoDB
    // arquivos.forEach((arquivo) => {
    //   const newArquivo = new Arquivo({
    //     denunciaId: denunciaResult.insertId,
    //     fileType: arquivo.fileType,
    //     filePath: arquivo.filePath
    //   });

    //   newArquivo.save()
    //     .then(() => console.log('Arquivo salvo no MongoDB'))
    //     .catch((err) => console.error('Erro ao salvar arquivo:', err));
    // });

    res.status(201).send('Denúncia criada com sucesso');
  });
});

router.get('/denuncias/:id', (req, res) => {
  const id = req.params.id;

  Denuncia.findById(id, (err, result) => {
    if (err || !result) return res.status(404).send("Erro ao buscar denúncia");

    return res.status(200).send(result);
  })
})

router.get('/denuncias', (req, res) => {
  Denuncia.findAll((err, result) => {
    if (err) return res.status(500).send("Erro ao buscar denúncias");

    return res.status(200).send(result);
  })
})

module.exports = router;
