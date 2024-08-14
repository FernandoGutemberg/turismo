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

//USUÁRIOS
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
    const userId = req.params.id;

    const UserModel = mongoose.model('Users', userSchema);

    const usuario = await UserModel.findById(userId);

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});


//Aqui vai pegar os dados do MongoDB com a rota Get e atualiza na tabela
router.get('/Tabelausuarios', async (req, res) => {
  try {
    let UserModel = mongoose.model('Users', userSchema);

    let usuarios = await UserModel.find();

    res.json(usuarios);

  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});


// Esta rota lida com requisições HTTP DELETE e é usada para excluir um usuário específico do banco de dados, baseado em seu ID.
//  O ID é extraído da URL e o usuário correspondente é removido do banco de dados. O registro excluído é retornado como resposta.
router.delete('/tabelausuarios/:id', async (req, res) => {
  try {
    let UserModel = mongoose.model('Users', userSchema);
    const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
    res.json(deletedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Aqui é a rota para ATUALIZAR
router.patch('/Cadastrousuarios/:id?', async (req, res) => {
  try {
    const userId = req.params.id;

    const UserModel = mongoose.model('Users', userSchema);

    let usuario;

    usuario = await UserModel.findById(userId);

    usuario.nomecompleto = req.body.nomeCompleto;
    usuario.cpf = req.body.cpf;
    usuario.datanascimento = req.body.dataNascimento;
    usuario.telefone = req.body.telefone;
    usuario.email = req.body.email;
    usuario.senha = req.body.senha;

    await usuario.save();

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

//--------------------------------------------------------------------------------------------------------------------------------------------

//parte dos LOCAIS
//Define uma rota http para '/cadastro' - AQUI NOS MANDAMOS OS DADOS PARA O MONGODB
router.post('/Cadastrolocais', async (req, res) => {
  try {
    let LocalModel = mongoose.model('Locais', locaisSchema);

    let local = new LocalModel({
      paisLocal: req.body.paisLocal,
      estado: req.body.estado,
      cidade: req.body.cidade,
      bairro: req.body.bairro,
      foto: req.body.foto, 
      avaliacao: req.body.avaliacao,
      descricao: req.body.descricao,
    });

    await local.save();

    res.json("Salvei");
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

//Pega os dados para atualizar
router.get('/getCadastrolocaisFromId/:id', async (req, res) => {

  try {
    const locaisId = req.params.id;

    const LocalModel = mongoose.model('Locais', locaisSchema);

    const locais = await LocalModel.findById(locaisId);

    if (!locais) {
      return res.status(404).json({ erro: 'Local não encontrado' });
    }

    res.json(locais);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

//Aqui vai pegar os dados do MongoDB com a rota Get e atualiza na tabela
router.get('/Tabelalocais', async (req, res) => {
  try {
    let LocalModel = mongoose.model('Locais', locaisSchema);

    let locais = await LocalModel.find();

    res.json(locais);

  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Esta rota lida com requisições HTTP DELETE e é usada para excluir um usuário específico do banco de dados, baseado em seu ID.
router.delete('/tabelalocais/:id', async (req, res) => {
  try {
    let LocalModel = mongoose.model('Locais', locaisSchema);

    const deleteLocal = await LocalModel.findByIdAndDelete(req.params.id);

    res.json(deleteLocal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Aqui é a rota para ATUALIZAR
router.patch('/Cadastrolocais/:id?', async (req, res) => {
  try {
    const localId = req.params.id;

    const LocalModel = mongoose.model('Locais', locaisSchema);

    let local;

    local = await LocalModel.findById(localId);

    local.paislocal = req.body.paislocal;
    local.estado = req.body.estado;
    local.cidade = req.body.cidade;
    local.bairro = req.body.bairro;
    local.foto = req.body.foto;
    local.avaliacao = req.body.avaliacao;
    local.descricao = req.body.descricao;

    await local.save();

    res.json(local);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

//---------------------------------------------------------------------------------------

//parte da Foto dos locais
router.post('/Cadastrofotolocais', async (req, res) => {
  try {
    let FotolocaisModel = mongoose.model('Fotolocais', fotolocaisSchema);

    let fotolocais = new FotolocaisModel({
      uploadfoto: req.body.uploadfoto,
      local: req.body.local,
      descricao: req.body.descricao,
      localizacao: req.body.localizacao,
      adicionadopor: req.body.adicionadopor,
      criadoem: req.body.criadoem,

    });

    await fotolocais.save();

    res.json("Salvei");
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});


//Pega os dados para atualizar
router.get('/getCadastrofotolocaisFromId/:id', async (req, res) => {

  try {
    const fotolocaisId = req.params.id;

    const FotolocaisModel = mongoose.model('Fotolocais', fotolocaisSchema);

    const fotolocais = await FotolocaisModel.findById(fotolocaisId);

    if (!fotolocais) {
      return res.status(404).json({ erro: 'Fotos Local não encontrado' });
    }

    res.json(fotolocais);
  } catch (error) {
    //Se houver um erro, responde com um status de erro e mensagem
    res.status(500).json({ erro: error.message });
  }
});

//Aqui vai pegar os dados do MongoDB com a rota Get e atualiza na tabela
router.get('/Tabelafotos', async (req, res) => {
  try {
    let FotolocaisModel = mongoose.model('Fotolocais', fotolocaisSchema);

    let fotolocais = await FotolocaisModel.find();

    res.json(fotolocais);

  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Esta rota lida com requisições HTTP DELETE e é usada para excluir um usuário específico do banco de dados, baseado em seu ID.
router.delete('/Tabelafotos/:id', async (req, res) => {
  try {
    let FotolocaisModel = mongoose.model('Fotolocais', fotolocaisSchema);

    const deleteFotolocais = await FotolocaisModel.findByIdAndDelete(req.params.id);

    res.json(deleteFotolocais);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Aqui é a rota para ATUALIZAR
router.patch('/Cadastrofotolocais/:id?', async (req, res) => {
  try {
    const fotolocaisId = req.params.id;

    const FotolocaisModel = mongoose.model('Fotolocais', fotolocaisSchema);

    let fotolocais;

    fotolocais = await FotolocaisModel.findById(fotolocaisId);

    fotolocais.nomedolocal = req.body.nomedolocal;
    fotolocais.descricao = req.body.descricao;
    fotolocais.fotodolocal = req.body.fotodolocal;
    fotolocais.avaliacao = req.body.avaliacao;

    await fotolocais.save();

    res.json(fotolocais);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});


//parte do Orçamento 

router.post('/Cadastroorcamento', async (req, res) => {
  try {
    let OrcamentoModel = mongoose.model('Orcamento', orcamentoSchema);

    let orcamento = new OrcamentoModel({
      tituloOrcamento: req.body.tituloOrcamento,
      dataViagem: req.body.dataViagem,
      moeda: req.body.moeda,
      custoTransporte: req.body.custoTransporte,
      custoHospedagem: req.body.custoHospedagem,
      custoAlimentacao: req.body.custoAlimentacao,
      custoAtividades: req.body.custoAtividades,
      outrosCustos: req.body.outrosCustos,
      observacao: req.body.observacao,
    });

    await orcamento.save();

    res.json("Salvei");
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Pega os dados para atualizar
router.get('/getCadastroorcamentoFromId/:id', async (req, res) => {
  try {
    const orcamentoId = req.params.id;

    const OrcamentoModel = mongoose.model('Orcamento', orcamentoSchema);

    const orcamento = await OrcamentoModel.findById(orcamentoId);

    if (!orcamento) {
      return res.status(404).json({ erro: 'Orçamento não encontrado' });
    }

    res.json(orcamento);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Pega todos os orçamentos do MongoDB
router.get('/Tabelaorcamento', async (req, res) => {
  try {
    let OrcamentoModel = mongoose.model('Orcamento', orcamentoSchema);

    let orcamentos = await OrcamentoModel.find();
    res.json(orcamentos);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Exclui um orçamento específico baseado em seu ID
router.delete('/Tabelaorcamento/:id', async (req, res) => {
  try {
    let OrcamentoModel = mongoose.model('Orcamento', orcamentoSchema);

    const deleteOrcamento = await OrcamentoModel.findByIdAndDelete(req.params.id);

    res.json(deleteOrcamento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualiza um orçamento específico
router.patch('/Cadastroorcamento/:id?', async (req, res) => {
  try {
    const orcamentoId = req.params.id;

    const OrcamentoModel = mongoose.model('Orcamento', orcamentoSchema);

    let orcamento = await OrcamentoModel.findById(orcamentoId);

    if (!orcamento) {
      return res.status(404).json({ erro: 'Orçamento não encontrado' });
    }

    orcamento.tituloOrcamento = req.body.tituloOrcamento;
    orcamento.dataViagem = req.body.dataViagem;
    orcamento.moeda = req.body.moeda;
    orcamento.custoTransporte = req.body.custoTransporte;
    orcamento.custoHospedagem = req.body.custoHospedagem;
    orcamento.custoAlimentacao = req.body.custoAlimentacao;
    orcamento.custoAtividades = req.body.custoAtividades;
    orcamento.outrosCustos = req.body.outrosCustos;
    orcamento.observacao = req.body.observacao; sporte = req.body.custoTransporte;

    await orcamento.save();

    res.json(orcamento);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});


//parte das mensagens

// Rota para criar uma nova mensagem
router.post('/Cadastromensagens', async (req, res) => {
  try {
    let MensagensModel = mongoose.model('Mensagens', mensagensSchema);

    let mensagem = new MensagensModel({
      tituloMensagem: req.body.tituloMensagem,
      conteudoMensagem: req.body.conteudoMensagem,
      tipoMensagem: req.body.tipoMensagem,
      anexos: req.body.anexos,
      dataHora: req.body.dataHora,
      avaliacao: req.body.avaliacao,
      respostaComentarios: req.body.respostaComentarios,
    });

    await mensagem.save();

    res.json("Mensagem salva com sucesso!");
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Rota para pegar uma mensagem específica pelo ID
router.get('/getCadastromensagensFromId/:id', async (req, res) => {
  try {
    const mensagemId = req.params.id;

    const MensagensModel = mongoose.model('Mensagens', mensagensSchema);


    const mensagem = await MensagensModel.findById(mensagemId);

    if (!mensagem) {
      return res.status(404).json({ erro: 'Mensagem não encontrada' });
    }

    res.json(mensagem);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Rota para pegar todas as mensagens do MongoDB
router.get('/Tabelamensagens', async (req, res) => {
  try {
    let MensagensModel = mongoose.model('Mensagens', mensagensSchema);

    let mensagens = await MensagensModel.find();

    res.json(mensagens);

  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Rota para excluir uma mensagem específica pelo ID
router.delete('/Tabelamensagens/:id', async (req, res) => {
  try {
    let MensagensModel = mongoose.model('Mensagens', mensagensSchema);

    const deleteMensagem = await MensagensModel.findByIdAndDelete(req.params.id);

    res.json(deleteMensagem);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Rota para atualizar uma mensagem específica
router.patch('/Cadastromensagens/:id?', async (req, res) => {
  try {
    const mensagemId = req.params.id;

    const MensagensModel = mongoose.model('Mensagens', mensagensSchema);

    let mensagem = await MensagensModel.findById(mensagemId);

    if (!mensagem) {
      return res.status(404).json({ erro: 'Mensagem não encontrada' });
    }

    mensagem.tituloMensagem = req.body.tituloMensagem;
    mensagem.conteudoMensagem = req.body.conteudoMensagem;
    mensagem.tipoMensagem = req.body.tipoMensagem;
    mensagem.anexos = req.body.anexos;
    mensagem.dataHora = req.body.dataHora;
    mensagem.avaliacao = req.body.avaliacao;
    mensagem.respostaComentarios = req.body.respostaComentarios;

    await mensagem.save();
    
    res.json(mensagem);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});


module.exports = router;
