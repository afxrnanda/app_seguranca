const express = require('express');
const router = express.Router();
const Usuario = require('../models/mysql/usuarios');

// Rota para registrar um novo usuário
router.post('/register', (req, res) => {
  const { nome, email, senha } = req.body;
  console.log(req.body)

  Usuario.create({ nome, email, senha }, (err, result) => {
    console.log(err)
    if (err) return res.status(500).send('Erro ao criar usuário');
    res.status(201).send('Usuário registrado com sucesso');
  });
});

// Rota para login de usuário
router.post('/login', (req, res) => {
  const { email, senha } = req.body;
  Usuario.findByUsername(email, (err, user) => {
    if (err) return res.status(500).send('Erro ao buscar usuário');
    if (!user || user.senha !== senha) {
      return res.status(401).send('Credenciais inválidas');
    }
    res.send('Login realizado com sucesso');
  });
});

module.exports = router;
