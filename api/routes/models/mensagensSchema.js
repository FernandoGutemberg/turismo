const mongoose = require('mongoose');

const mensagensSchema = new mongoose.Schema({
    localId: mongoose.Schema.Types.ObjectId,
    tituloMensagem: String,
    conteudoMensagem: String,
    tipoMensagem: String,
    avaliacao: String,
    dataCadastro: { type: Date, default: Date.now } 


});
const MensagensModel = mongoose.model('Mensagens', mensagensSchema);

module.exports = mensagensSchema;
