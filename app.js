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

// Configuração de middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servindo CSS e Imagens a partir da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Servindo o HTML a partir da pasta views
app.use(express.static(path.join(__dirname, 'views')));

// Usando as rotas
app.use('/', userRoutes);
app.use('/', denunciaRoutes);
app.use('/', staticRoutes);

// Rota de cadastro
app.post('/register', async (req, res) => {
  const { email, password, nome } = req.body;

  // Verificar se todos os campos estão presentes
  if (!email || !password || !nome) {
    console.log('Campos obrigatórios faltando:', { email, password, nome });
    return res.status(400).send('Todos os campos são obrigatórios.');
  }

  try {
    // Conectar ao MongoDB
    const db = await connectToDatabase();
    const usuariosCollection = db.collection('usuarios');
    
    // Verificar se o email já existe no banco
    const usuarioExistente = await usuariosCollection.findOne({ email });
    if (usuarioExistente) {
      console.log('Usuário já cadastrado:', email);
      return res.status(400).send('Usuário já cadastrado.');
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Senha criptografada:', hashedPassword);

    // Inserir o novo usuário com a senha criptografada no MongoDB
    await usuariosCollection.insertOne({
      email: email,
      senha: hashedPassword, // Salvar a senha criptografada no MongoDB
      nome: nome
    });

    console.log('Usuário cadastrado com sucesso:', { email, nome });
    
    // Redirecionar para a tela inicial
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

    console.log('Usuário encontrado:', usuario);

    // Comparar a senha fornecida com a senha armazenada (em texto simples)
    const isMatch = password === usuario.senha;

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
