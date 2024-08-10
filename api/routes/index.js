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

//Aqui estão os esquemas, seria como o modelo para criar o espaço de dados no MongoDB
const userSchema = require('./models/userSchema');
const locaisSchema = require('./models/locaisSchema');
const fotolocaisSchema = require('./models/fotolocaisSchema');
const orcamentoSchema = require('./models/orcamentoSchema');
const mensagensSchema = require('./models/mensagensSchema');


//AQUI NOS MANDAMOS OS DADOS PARA O MONGODB
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


//Aqui vai pegar os dados do MongoDB com a rota Get e atualiza na tabela
router.get('/Tabelausuarios', async (req, res) => {
  try {
    // Cria um modelo de usuário usando o mongoose
    let UserModel = mongoose.model('Users', userSchema);

    // Busca todos os usuários no banco de dados
    let usuarios = await UserModel.find();

    // Responde com os dados dos usuários
    res.json(usuarios);

  } catch (error) {
    // Se houver um erro, responde com um status de erro e mensagem
    res.status(500).json({ erro: error.message });
  }
});


// Esta rota lida com requisições HTTP DELETE e é usada para excluir um usuário específico do banco de dados, baseado em seu ID.
//  O ID é extraído da URL e o usuário correspondente é removido do banco de dados. O registro excluído é retornado como resposta.
router.delete('/tabelausuarios/:id', async (req, res) => {
  try {
    //Obtendo o modelo de usuário definido no mongodb utilizando o mongoose. 
    let UserModel = mongoose.model('Users', userSchema);
    //Executa uma operação de exclusao no Banco de Dados. 
    const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
    //Atualiza o que foi exluido e retorna sem o registro. 
    res.json(deletedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



//Aqui é a rota para ATUALIZAR
router.patch('/Cadastrousuarios/:id?', async (req, res) => {
  try {
    // Obtém o ID do usuário da URL, se fornecido
    const userId = req.params.id;

    // Cria um modelo de usuário usando o mongoose
    const UserModel = mongoose.model('Users', userSchema);

    let usuario;

    usuario = await UserModel.findById(userId);

    // Preenche os dados do usuário com os dados fornecidos no corpo da requisição
    usuario.nomecompleto = req.body.nomeCompleto;
    usuario.cpf = req.body.cpf;
    usuario.datanascimento = req.body.dataNascimento;
    usuario.telefone = req.body.telefone;
    usuario.email = req.body.email;
    usuario.senha = req.body.senha;

    // Salva o usuário no banco de dados
    await usuario.save();

    // Responde com os dados do usuário salvo
    res.json(usuario);
  } catch (error) {
    // Se houver um erro, responde com um status de erro e mensagem
    res.status(500).json({ erro: error.message });
  }
});






//--------------------------------------------------------------------------------------------------------------------------------------------


//parte dos LOCAIS

//Define uma rota http para '/cadastro' - AQUI NOS MANDAMOS OS DADOS PARA O MONGODB
router.post('/Cadastrolocais', async (req, res) => {
  try {
    //Cria um novo usuário com base nos dados do corpo da requisição
    let LocalModel = mongoose.model('Locais', locaisSchema);

    //Cria uma nova instância de usuário com base nos dados recebidos na requisição
    let local = new LocalModel({
      paisLocal: req.body.paisLocal,
      estado: req.body.estado,
      cidade: req.body.cidade,
      bairro: req.body.bairro,
      foto: req.body.foto, // Caminho do arquivo armazenado
      avaliacao: req.body.avaliacao,
      descricao: req.body.descricao,
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

//Aqui vai pegar os dados do MongoDB com a rota Get e atualiza na tabela
router.get('/Tabelalocais', async (req, res) => {
  try {
    // Cria um modelo de usuário usando o mongoose
    let LocalModel = mongoose.model('Locais', locaisSchema);

    // Busca todos os usuários no banco de dados
    let locais = await LocalModel.find();

    // Responde com os dados dos usuários
    res.json(locais);

  } catch (error) {
    // Se houver um erro, responde com um status de erro e mensagem
    res.status(500).json({ erro: error.message });
  }
});

// Esta rota lida com requisições HTTP DELETE e é usada para excluir um usuário específico do banco de dados, baseado em seu ID.
//  O ID é extraído da URL e o usuário correspondente é removido do banco de dados. O registro excluído é retornado como resposta.
router.delete('/tabelalocais/:id', async (req, res) => {
  try {
    //Obtendo o modelo de usuário definido no mongodb utilizando o mongoose. 
    let LocalModel = mongoose.model('Locais', locaisSchema);
    //Executa uma operação de exclusao no Banco de Dados. 
    const deleteLocal = await LocalModel.findByIdAndDelete(req.params.id);
    //Atualiza o que foi exluido e retorna sem o registro. 
    res.json(deleteLocal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Esta rota lida com requisições HTTP DELETE e é usada para excluir um usuário específico do banco de dados, baseado em seu ID.
//  O ID é extraído da URL e o usuário correspondente é removido do banco de dados. O registro excluído é retornado como resposta.
router.delete('/tabelausuarios/:id', async (req, res) => {
  try {
    //Obtendo o modelo de usuário definido no mongodb utilizando o mongoose. 
    let UserModel = mongoose.model('Users', userSchema);
    //Executa uma operação de exclusao no Banco de Dados. 
    const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
    //Atualiza o que foi exluido e retorna sem o registro. 
    res.json(deletedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



//parte da Foto dos locais

router.post('/Cadastrofotolocais', async (req, res) => {
  try {
    //Cria um novo usuário com base nos dados do corpo da requisição
    let FotolocaisModel = mongoose.model('Fotolocais', fotolocaisSchema);

    //Cria uma nova instância de usuário com base nos dados recebidos na requisição
    let fotolocais = new FotolocaisModel({
      nomedolocal: req.body.nomedolocal,
      descricao: req.body.descricao,
      fotodolocal: req.body.fotodolocal,
      avaliacao: req.body.avaliacao,
    });

    // Capturar os dados
    await fotolocais.save();

    // Responde com o objeto de usuário salvo
    res.json("Salvei");
  } catch (error) {
    // Se houver um erro, responde com um status de erro e mensagem
    res.status(500).json({ erro: error.message });
  }
});

//parte do Orçamento 

router.post('/Cadastroorcamento', async (req, res) => {
  try {
    //Cria um novo usuário com base nos dados do corpo da requisição
    let OrcamentoModel = mongoose.model('Orcamento', orcamentoSchema);

    //Cria uma nova instância de usuário com base nos dados recebidos na requisição
    let orcamento = new OrcamentoModel({
      nomedolocal: req.body.nomedolocal,
      descricao: req.body.descricao,
      fotodolocal: req.body.fotodolocal,
      avaliacao: req.body.avaliacao,
    });

    // Capturar os dados
    await orcamento.save();

    // Responde com o objeto de usuário salvo
    res.json("Salvei");
  } catch (error) {
    // Se houver um erro, responde com um status de erro e mensagem
    res.status(500).json({ erro: error.message });
  }
});

//parte das mensagens

router.post('/Cadastromensagens', async (req, res) => {
  try {
    //Cria um novo usuário com base nos dados do corpo da requisição
    let MensagensModel = mongoose.model('Mensagens', mensagensSchema);

    //Cria uma nova instância de usuário com base nos dados recebidos na requisição
    let mensagens = new MensagensModel({
      nomedolocal: req.body.nomedolocal,
      descricao: req.body.descricao,
      fotodolocal: req.body.fotodolocal,
      avaliacao: req.body.avaliacao,
    });

    // Capturar os dados
    await mensagens.save();

    // Responde com o objeto de usuário salvo
    res.json("Salvei");
  } catch (error) {
    // Se houver um erro, responde com um status de erro e mensagem
    res.status(500).json({ erro: error.message });
  }
});

module.exports = router;
