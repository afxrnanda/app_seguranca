const path = require('path');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '/views/TelaInicial.html'))
})

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '/views/TelaLogin.html'))
})

router.get('/:page', (req, res) => {
  const page = req.params.page;
  const filePath = path.join(__dirname, '..', `/views/${page}.html`);

  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send('Page not found');
    }
  });
});

module.exports = router;
