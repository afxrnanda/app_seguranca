const express = require('express');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const denunciaRoutes = require('./routes/denunciaRoutes');
const staticRoutes = require('./routes/staticRoutes');
const bodyParser = require('body-parser');
const mysql = require('./mysql');
const bcrypt = require('bcrypt');
const connectToDatabase = require('./mongodb');

const app = express();
const port = 3000;
app.use(express.json());

// Servindo CSS e Imagens a partir da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Servindo o HTML a partir da pasta views
app.use(express.static(path.join(__dirname, 'views')));

// Usando as rotas
app.use('/', userRoutes);
app.use('/', denunciaRoutes);
app.use('/', staticRoutes);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Rota de cadastro
app.post('/register', async (req, res) => {
  const { email, password, nome } = req.body;

  if (!email || !password || !nome) {
    return res.status(400).send('Todos os campos são obrigatórios.');
  }

  try {
    const db = await connectToDatabase();
    const usuariosCollection = db.collection('usuarios');

    // Verificar se o email já existe
    const usuarioExistente = await usuariosCollection.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).send('Usuário já cadastrado.');
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserir o usuário no MongoDB
    await usuariosCollection.insertOne({ email, senha: hashedPassword, nome });

    res.redirect('/TelaInicial.html');
  } catch (err) {
    console.error('Erro ao cadastrar o usuário:', err);
    res.status(500).send('Erro no servidor.');
  }
});


// Rota de login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Por favor, forneça email e senha.');
  }

  try {
    const db = await connectToDatabase();
    const usuariosCollection = db.collection('usuarios');

    // Procurar o usuário no banco de dados pelo email
    const usuario = await usuariosCollection.findOne({ email });
    
    if (!usuario) {
      console.log('Usuário não encontrado, redirecionando para a tela de cadastro.');
      return res.redirect('/TelaCadastro.html');
    }

    // Verifique se o usuário foi encontrado
    console.log('Usuário encontrado:', usuario);

    // Comparar a senha fornecida com a senha criptografada
    const isMatch = await bcrypt.compare(password, usuario.senha);

    if (!isMatch) {
      console.log('Senha incorreta.');
      return res.status(401).send('Credenciais inválidas. Senha incorreta.');
    }

    console.log('Login bem-sucedido, redirecionando para a tela inicial.');
    return res.redirect('/TelaInicial.html');
  } catch (err) {
    console.error('Erro ao realizar o login:', err);
    res.status(500).send('Erro no servidor.');
  }
});



// Rota para receber o formulário
app.post('/submit-report', (req, res) => {
  const reportText = req.body.reportText;

  if (!reportText) {
      return res.status(400).send('Texto do report não pode estar vazio');
  }

  // Query para inserir o report no banco de dados
  const query = 'INSERT INTO reports (report_text) VALUES (?)';

  mysql.query(query, [reportText], (err, result) => {
      if (err) {
          console.error('Erro ao inserir o report:', err);
          return res.status(500).send('Erro ao salvar o report');
      }
      res.send('Report enviado com sucesso!');
  });
});


app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

module.exports = app;