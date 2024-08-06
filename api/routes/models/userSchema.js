//importa o modulo mongoose, que é uma biblioteca do Node.js usada para interagir com o banco de dados MongoDB
const mongoose = require('mongoose');

//estamos definindo um novo schema para os documentos de usuário no B.D 
const userSchema = new mongoose.Schema({
  nomecompleto: String,
  cpf: String,
  sexo: String,
  telefone: String,
  senha: String,
  email: String,
});
const UserModel = mongoose.model('User', userSchema); //processo de compilação


module.exports = userSchema;
