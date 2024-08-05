var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://fernando_turismo:vVwj1hN19TTusbJR@turimoapp.x4wghtm.mongodb.net/?retryWrites=true&w=majority&appName=turimoapp')
  .then(() => {
    console.log('Conectado ao MongoDB');
  })
  .catch(err => {
    console.error('Erro ao conectar ao MongoDB', err);
  });

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

console.log("Olhá, o Back-End está rodando viu!");

module.exports = router;
