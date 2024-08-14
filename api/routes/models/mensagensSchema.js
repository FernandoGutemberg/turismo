const mongoose = require('mongoose');

const mensagensSchema = new mongoose.Schema({
    tituloMensagem: String,
    conteudoMensagem: String,
    tipoMensagem: String,
    dataHora: String,
    avaliacao: String,
    respostaComentarios: String,

});
const MensagensModel = mongoose.model('Mensagens', mensagensSchema);

module.exports = mensagensSchema;
