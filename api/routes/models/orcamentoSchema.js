const mongoose = require('mongoose');

const orcamentoSchema = new mongoose.Schema({
    localId: mongoose.Schema.Types.ObjectId,
    tituloOrcamento: String,               
    custoAlimentacao: Number,             
    custoAtividades: Number,               
});
const OrcamentoModel = mongoose.model('Orcamento', orcamentoSchema); 

module.exports = orcamentoSchema;
