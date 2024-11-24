const express = require('express');
const router = express.Router();
const cors = require('cors'); // Importa o middleware CORS

// Configuração personalizada do CORS
const corsOptions = {
  origin: 'http://localhost:3000', // Origem permitida
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
  credentials: true, // Se precisar enviar cookies ou autenticação
};

// Aplicar o middleware CORS apenas neste router
router.use(cors(corsOptions));

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


//____________AQUIIIIIIIIIIIIIIIIIIIIIII PRA FRENTE

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
      rua: req.body.rua,
      cep: req.body.cep,
      local: req.body.local,
      foto: req.body.foto,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
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
    // console.log("Locais recebido no backend:", locais);


    // Agregação para obter a contagem de locais cadastrados por mês
    const dadosPorMes = await LocalModel.aggregate([
      {
        $group: {
          _id: { ano: { $year: "$dataCadastro" }, mes: { $month: "$dataCadastro" } },
          total: { $sum: 1 }
        }
      },
      { $sort: { "_id.ano": 1, "_id.mes": 1 } }
    ]);
    console.log("Locais encontradas dados formatados:", dadosPorMes);


    // Formatação dos dados para enviar para o frontend
    const dadosFormatados = dadosPorMes.map(item => ({
      ano: item._id.ano,
      mes: item._id.mes,
      total: item.total
    }));
    console.log("Locais dadosFormatados encontradas dados formatados:", dadosFormatados);


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

    local.paisLocal = req.body.paisLocal;
    local.estado = req.body.estado;
    local.cidade = req.body.cidade;
    local.bairro = req.body.bairro;
    local.rua = req.body.rua;
    local.cep = req.body.cep;
    local.local = req.body.local;
    local.foto = req.body.foto;

    await local.save();

    res.json(local);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});


//____________AQUIIIIIIIIIIIIIIIIIIIIIII PRA TRÁS

//---------------------------------------------------------------------------------------

//parte da Foto dos locais
router.post('/Cadastrofotolocais', async (req, res) => {
  try {
    let FotolocaisModel = mongoose.model('Fotolocais', fotolocaisSchema);

    let fotolocais = new FotolocaisModel({
      localId: req.body.localId,
      uploadfoto: req.body.uploadfoto,
      descricao: req.body.descricao,

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
    // ----- ESSA ALTE
    const localId = req.query.localId;  // Pegando o localId da query string
    // ----- ESSA ALTE


    let FotolocaisModel = mongoose.model('Fotolocais', fotolocaisSchema);
    let LocalModel = mongoose.model('Locais', locaisSchema);

    let fotolocais = await FotolocaisModel.find({ localId });

    // Para cada foto, buscar os dados do local correspondente
    let fotosComLocal = await Promise.all(fotolocais.map(async (foto) => {
      let local = await LocalModel.findById(foto.localId).exec();
      return {
        ...foto._doc,  // Retorna todos os dados do documento original
        localInfo: local ? `${local.paisLocal} - ${local.estado} - ${local.cidade}` : 'Local não encontrado'
      };
    }));

    res.json(fotosComLocal);

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

    fotolocais.uploadfoto = req.body.uploadfoto;
    fotolocais.descricao = req.body.descricao;

    await fotolocais.save();

    res.json(fotolocais);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// ----------------------------------------------------------------------------
//parte do Orçamento 

router.post('/Cadastroorcamento', async (req, res) => {
  try {
    let OrcamentoModel = mongoose.model('Orcamento', orcamentoSchema);

    let orcamento = new OrcamentoModel({
      localId: req.body.localId,
      tituloOrcamento: req.body.tituloOrcamento,
      custoAlimentacao: req.body.custoAlimentacao,
      custoAtividades: req.body.custoAtividades,
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
    const localId = req.query.localId;  // Pegando o localId da query string
    console.log("LocalId recebido no backend:", localId);

    let OrcamentoModel = mongoose.model('Orcamento', orcamentoSchema);
    let LocalModel = mongoose.model('Locais', locaisSchema);

    let orcamentos = await OrcamentoModel.find({ localId });
    console.log("Orçamentos encontrados:", orcamentos);

    // Agregação para obter a contagem de orcamentos cadastrados por mês
    const dadosPorMes = await OrcamentoModel.aggregate([
      {
        $group: {
          _id: { ano: { $year: "$dataCadastro" }, mes: { $month: "$dataCadastro" } },
          total: { $sum: 1 }
        }
      },
      { $sort: { "_id.ano": 1, "_id.mes": 1 } }
    ]);

    // Formatação dos dados para enviar para o frontend
    const dadosFormatados = dadosPorMes.map(item => ({
      ano: item._id.ano,
      mes: item._id.mes,
      total: item.total
    }));
    console.log("Orcamento encontradas dados formatados:", dadosFormatados);




    let orcamentosComLocal = await Promise.all(orcamentos.map(async (orcamento) => {
      let local = await LocalModel.findById(orcamento.localId).exec();
      return {
        ...orcamento._doc,  // Retorna todos os dados do documento original
        localInfo: local ? `${local.paisLocal} - ${local.estado} - ${local.cidade}` : 'Local não encontrado'
      };
    }));
    console.log("orcamentosComLocal encontradas dados formatados:", orcamentosComLocal);



    res.json(orcamentosComLocal);
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
    orcamento.custoAlimentacao = req.body.custoAlimentacao;
    orcamento.custoAtividades = req.body.custoAtividades;

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
      localId: req.body.localId,
      tituloMensagem: req.body.tituloMensagem,
      conteudoMensagem: req.body.conteudoMensagem,
      tipoMensagem: req.body.tipoMensagem,
      avaliacao: req.body.avaliacao,
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
    const localId = req.query.localId;  // Pegando o localId da query string

    let MensagensModel = mongoose.model('Mensagens', mensagensSchema);
    let LocalModel = mongoose.model('Locais', locaisSchema);

    let mensagens = await MensagensModel.find({ localId });

    // Agregação para obter a contagem de locais cadastrados por mês
    const dadosPorMes = await MensagensModel.aggregate([
      {
        $group: {
          _id: { ano: { $year: "$dataCadastro" }, mes: { $month: "$dataCadastro" } },
          total: { $sum: 1 }
        }
      },
      { $sort: { "_id.ano": 1, "_id.mes": 1 } }
    ]);

    // Formatação dos dados para enviar para o frontend
    const dadosFormatados = dadosPorMes.map(item => ({
      ano: item._id.ano,
      mes: item._id.mes,
      total: item.total
    }));
    console.log("Mensagens encontradas dados formatados:", dadosFormatados);


    let mensagensComLocal = await Promise.all(mensagens.map(async (mensagem) => {
      let local = await LocalModel.findById(mensagem.localId).exec();
      return {
        ...mensagem._doc,  // Retorna todos os dados do documento original
        localInfo: local ? `${local.paisLocal} - ${local.estado} - ${local.cidade}` : 'Local não encontrado'
      };
    }));

    console.log("Mensagens encontradas com local:", mensagensComLocal);



    res.json(mensagensComLocal);
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
    mensagem.avaliacao = req.body.avaliacao;

    await mensagem.save();

    res.json(mensagem);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Array para armazenar tokens gerados
let tokens = [];


// Rota para login
router.get('/login', async (req, res) => {
  const { email, senha } = req.query;

  // Loga os dados recebidos para fins de depuração
  console.log('Dados recebidos:', email, senha);

  try {
    // Define o modelo de usuário do MongoDB
    const User = mongoose.model('User', userSchema);

    // Procura um usuário no banco de dados com o email e senha fornecidos
    const usuario = await User.findOne({ email, senha });

    // Se o usuário não for encontrado, retorna um erro 403 (Proibido)
    if (!usuario) {
      console.log('Usuário não encontrado ou senha incorreta.');
      return res.status(403).json({ erro: 'Email ou senha incorretos' });
    }

    // Função para gerar uma string aleatória de um tamanho especificado
    function gerarStringAleatoria(tamanho) {
      const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // Define os caracteres que podem ser usados no token
      let resultado = ''; // String resultante que será retornada
      const comprimentoCaracteres = caracteres.length; // Comprimento da string de caracteres

      // Loop para gerar a string aleatória
      for (let i = 0; i < tamanho; i++) {
        // Gera um índice aleatório e adiciona o caractere correspondente à string resultante
        const indiceAleatorio = Math.floor(Math.random() * comprimentoCaracteres);
        resultado += caracteres.charAt(indiceAleatorio);
      }

      return resultado; // Retorna a string aleatória gerada
    }

    // Função para gerar um token único
    function gerarTokenUnico() {
      // Gera uma string aleatória inicial
      //(Ação 1)
      let token = gerarStringAleatoria(6);
      // Verifica se o token já existe na lista de tokens
      // Ação 2: Verifica se o token já existe na lista de tokens
      while (tokens.includes(token)) {
        // Se o token já existir, gera um novo token (Ação 2)
        token = gerarStringAleatoria(6);
      }
      // Ação 1: Retorna o token único gerado (implicando que ele será inserido na lista depois)

      return token; // Retorna o token único gerado
    }

    // Se o usuário for encontrado, gera um token único
    const token = gerarTokenUnico();
    tokens.push(token); // Armazena o token gerado na lista

    // Mostrar lista de tokens
    console.log('Tokens gerados:', tokens);

    // Retorna um status de sucesso com o token gerado
    return res.status(200).json({ sucesso: true, mensagem: 'Login bem-sucedido', token });
  } catch (error) {
    // Loga o erro para fins de depuração
    console.error('Erro ao tentar fazer login:', error);
    // Em caso de erro, retorna um status 500 (Erro Interno do Servidor) com uma mensagem de erro
    res.status(500).json({ erro: 'Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.' });
  }
});

// Rota para verificar se um token é válido
router.post('/verificarToken', (req, res) => {
  console.log('Rota /verificarToken foi acessada.');
  const { token } = req.body;

  // Verifica se o token está presente na lista de tokens
  if (tokens.includes(token)) {
    // Se o token estiver presente, retorna um JSON com validado: true
    res.json({ validado: true });
    console.log("Mensagem retornando", true);
  } else {
    // Se o token não estiver presente, retorna um JSON com validado: false
    res.json({ validado: false });
    console.log("Mensagem retornando", false);
  }
});


// Rota para logout e remoção do token
router.get('/logoutToken', (req, res) => {
  console.log('Rota /logoutToken foi acessada.');
  const token = req.query.token; // Obtém o token dos parâmetros da query string
  console.log('Token recebido:', token);

  // Verifica o estado da lista de tokens antes da verificação
  console.log('Lista de tokens antes da verificação:', tokens);

  // Verifica se o token está presente na lista de tokens
  if (tokens.includes(token)) {
    // Remove o token da lista de tokens
    tokens = tokens.filter(t => t !== token);
    res.json({ mensagem: 'Logout realizado com sucesso.' });
    console.log("Token removido:", token);
  } else {
    res.status(404).json({ mensagem: 'Token não encontrado.' });
    console.log("Token não encontrado:", token);
  }

  // Verifica o estado da lista de tokens após a remoção
  console.log('Lista de tokens após a remoção:', tokens);
});





module.exports = router;
