//importa o modulo mongoose, que é uma biblioteca do Node.js usada para interagir com o banco de dados MongoDB
const mongoose = require('mongoose');

//estamos definindo um novo schema para os documentos de usuário no B.D 
const mensagensSchema = new mongoose.Schema({
    tituloMensagem: String,
    conteudoMensagem: String,
    tipoMensagem: String,
    dataHora: String,
    avaliacao: String,
    respostaComentarios: String,

});
const MensagensModel = mongoose.model('Mensagens', mensagensSchema); //processo de compilação


module.exports = mensagensSchema;
