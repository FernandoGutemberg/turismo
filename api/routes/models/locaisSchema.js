const mongoose = require('mongoose');

const locaisSchema = new mongoose.Schema({
    paisLocal: String,
    estado: String,
    cidade: String,
    bairro: String,
    foto: String,
    avaliacao: String,
    descricao: String,

});
const LocalModel = mongoose.model('Locais', locaisSchema);

module.exports = locaisSchema;

