//importa o modulo mongoose, que é uma biblioteca do Node.js usada para interagir com o banco de dados MongoDB
const mongoose = require('mongoose');

//estamos definindo um novo schema para os documentos de usuário no B.D 
const fotolocaisSchema = new mongoose.Schema({
    nomedolocal: String,
    descricao: String,
    fotodolocal: String,
    avaliacao: String,
});
const FotolocaisModel = mongoose.model('Fotolocais', fotolocaisSchema); //processo de compilação


module.exports = fotolocaisSchema;
