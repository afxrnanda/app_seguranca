const express = require('express');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const denunciaRoutes = require('./routes/denunciaRoutes');
const staticRoutes = require('./routes/staticRoutes');

const app = express();
app.use(express.json());

// Servindo CSS e Imagens a partir da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Servindo o HTML a partir da pasta views
app.use(express.static(path.join(__dirname, 'views')));

// Usando as rotas
app.use('/', userRoutes);
app.use('/', denunciaRoutes);
app.use('/', staticRoutes);

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});

module.exports = app;