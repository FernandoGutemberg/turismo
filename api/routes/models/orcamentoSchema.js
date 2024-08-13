//importa o modulo mongoose, que é uma biblioteca do Node.js usada para interagir com o banco de dados MongoDB
const mongoose = require('mongoose');

//estamos definindo um novo schema para os documentos de usuário no B.D 
const orcamentoSchema = new mongoose.Schema({
    tituloOrcamento: String,               
    dataViagem: String,                    
    moeda: String,                         
    custoTransporte: Number,               
    custoHospedagem: Number,               
    custoAlimentacao: Number,             
    custoAtividades: Number,               
    outrosCustos: Number,           
    observacao: String, 
});
const OrcamentoModel = mongoose.model('Orcamento', orcamentoSchema); //processo de compilação


module.exports = orcamentoSchema;
