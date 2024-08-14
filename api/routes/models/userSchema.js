const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nomecompleto: String,
  cpf: String,
  sexo: String,
  telefone: String,
  senha: String,
  email: String,
});
const UserModel = mongoose.model('User', userSchema); 

module.exports = userSchema;
