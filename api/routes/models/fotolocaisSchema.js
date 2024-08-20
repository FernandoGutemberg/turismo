const mongoose = require('mongoose');

const fotolocaisSchema = new mongoose.Schema({
    uploadfoto: String,
    descricao: String,

});
const FotolocaisModel = mongoose.model('Fotolocais', fotolocaisSchema); 

module.exports = fotolocaisSchema;

