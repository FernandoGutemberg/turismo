const mongoose = require('mongoose');

const locaisSchema = new mongoose.Schema({
    paisLocal: String,
    estado: String,
    cidade: String,
    bairro: String,
    rua: String,
    cep: String,
    local: String,
    foto: String,
    latitude: Number,
    longitude: Number,
    dataCadastro: { type: Date, default: Date.now } 

});
const LocalModel = mongoose.model('Locais', locaisSchema);

module.exports = locaisSchema;

