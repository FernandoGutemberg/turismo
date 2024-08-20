const mongoose = require('mongoose');

const mensagensSchema = new mongoose.Schema({
    tituloMensagem: String,
    conteudoMensagem: String,
    tipoMensagem: String,
    avaliacao: String,

});
const MensagensModel = mongoose.model('Mensagens', mensagensSchema);

module.exports = mensagensSchema;
