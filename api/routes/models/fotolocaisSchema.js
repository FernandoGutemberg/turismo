const mongoose = require('mongoose');

const fotolocaisSchema = new mongoose.Schema({
    uploadfoto: String,
    local: String,
    descricao: String,
    localizacao: String,
    adicionadopor: String,
    criadoem: String,

});
const FotolocaisModel = mongoose.model('Fotolocais', fotolocaisSchema); 

module.exports = fotolocaisSchema;

