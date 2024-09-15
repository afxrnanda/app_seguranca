const mongoose = require('mongoose');

const url = 'mongodb+srv://admin:MGGoA8eXUBrcoVXG@cluster0.qelem.mongodb.net/denuncias_db';

mongoose.connect(url)
  .then(() => console.log('Conectado ao MongoDB Atlas!'))
  .catch((error) => console.error('Erro ao conectar ao MongoDB:', error));

module.exports = mongoose;
