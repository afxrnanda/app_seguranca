const express = require('express');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const denunciaRoutes = require('./routes/denunciaRoutes');
const staticRoutes = require('./routes/staticRoutes');
const bodyParser = require('body-parser');
const mysql = require('./mysql');

const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

app.use('/', userRoutes);
app.use('/', denunciaRoutes);
app.use('/', staticRoutes);

// Rota para receber a denúncia
app.post('/submit-report', (req, res) => {
  const reportText = req.body.reportText;

  if (!reportText) {
      return res.status(400).send('Texto do report não pode estar vazio');
  }

  const query = 'INSERT INTO denuncias (report_text) VALUES (?)';

  mysql.query(query, [reportText], (err, result) => {
      if (err) {
          console.error('Erro ao inserir o report:', err);
          return res.status(500).send('Erro ao salvar o report');
      }
      res.redirect('/TelaForum.html');
  });
});

// Rota para exibir as denúncias
app.get('/denuncias', (req, res) => {
  const query = 'SELECT * FROM reports';

  mysql.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar as denúncias:', err);
      return res.status(500).send('Erro no servidor.');
    }

    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

module.exports = app;
