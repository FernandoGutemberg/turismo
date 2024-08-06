var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb+srv://fernando_turismo:vVwj1hN19TTusbJR@turimoapp.x4wghtm.mongodb.net/?retryWrites=true&w=majority&appName=turimoapp')
  .then(() => {
    console.log('Conectado ao MongoDB');
  })
  .catch(err => {
    console.error('Erro ao conectar ao MongoDB', err);
  });

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

console.log("Olhá, o Back-End está rodando viu!");

const userSchema = require('./models/userSchema');
const locaisSchema = require('./models/locaisSchema');

//Pega os dados para atualizar
router.get('/getCadastrousuariosFromId/:id', async (req, res) => {

  try {
    //Obtém o ID do usuário da URL
    const userId = req.params.id;

    //Cria um modelo de usuário usando o mongoose
    const UserModel = mongoose.model('Users', userSchema);

    //Busca o usuário pelo ID
    const usuario = await UserModel.findById(userId);

    //Se o usuário não for encontrado, retorna um erro 404
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    //Retorna os dados do usuário
    res.json(usuario);
  } catch (error) {
    //Se houver um erro, responde com um status de erro e mensagem
    res.status(500).json({ erro: error.message });
  }
});

//Define uma rota http para '/cadastro' - AQUI NOS MANDAMOS OS DADOS PARA O MONGODB
router.post('/Cadastrousuarios', async (req, res) => {
  try {
    //Cria um novo usuário com base nos dados do corpo da requisição
    let UserModel = mongoose.model('User', userSchema);

    //Cria uma nova instância de usuário com base nos dados recebidos na requisição
    let usuario = new UserModel({
      nomecompleto: req.body.nomeCompleto,
      cpf: req.body.cpf,
      sexo: req.body.sexo,
      telefone: req.body.telefone,
      email: req.body.email,
      senha: req.body.senha,
    });

    // Capturar os dados
    await usuario.save();

    // Responde com o objeto de usuário salvo
    res.json("Salvei");
  } catch (error) {
    // Se houver um erro, responde com um status de erro e mensagem
    res.status(500).json({ erro: error.message });
  }
});


//parte dos LOCAIS

//Define uma rota http para '/cadastro' - AQUI NOS MANDAMOS OS DADOS PARA O MONGODB
router.post('/Cadastrolocais', async (req, res) => {
  try {
    //Cria um novo usuário com base nos dados do corpo da requisição
    let LocalModel = mongoose.model('Locais', locaisSchema);

    //Cria uma nova instância de usuário com base nos dados recebidos na requisição
    let local = new LocalModel({
      nomedolocal: req.body.nomedolocal,
      descricao: req.body.descricao,
      fotodolocal: req.body.fotodolocal,
      avaliacao: req.body.avaliacao,
    });

    // Capturar os dados
    await local.save();

    // Responde com o objeto de usuário salvo
    res.json("Salvei");
  } catch (error) {
    // Se houver um erro, responde com um status de erro e mensagem
    res.status(500).json({ erro: error.message });
  }
});





module.exports = router;
