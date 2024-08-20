const mongoose = require('mongoose');

const locaisSchema = new mongoose.Schema({
    paisLocal: String,
    estado: String,
    cidade: String,
    foto: String,

});
const LocalModel = mongoose.model('Locais', locaisSchema);

module.exports = locaisSchema;

