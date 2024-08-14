const mongoose = require('mongoose');

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
const OrcamentoModel = mongoose.model('Orcamento', orcamentoSchema); 

module.exports = orcamentoSchema;
