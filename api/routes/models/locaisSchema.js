//importa o modulo mongoose, que é uma biblioteca do Node.js usada para interagir com o banco de dados MongoDB
const mongoose = require('mongoose');

//estamos definindo um novo schema para os documentos de usuário no B.D 
const locaisSchema = new mongoose.Schema({
    paisLocal: String,
    estado: String,
    cidade: String,
    bairro: String,
    foto: String,
    avaliacao: String,
    descricao: String,

});
const LocalModel = mongoose.model('Locais', locaisSchema); //processo de compilação


module.exports = locaisSchema;

