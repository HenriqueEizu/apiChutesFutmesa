const express = require('express');
const router = express.Router();
const mysql = require('mysql');
let config = require('../config.js');
var cors = require('cors')
const Login = require('../middleware/login');
const jogosControllers = require('../controllers/jogos-controller');
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.options('/', cors()) // enable pre-flight request for DELETE 
router.get('/', Login.obrigatorio, cors(), jogosControllers.GetAllJogos) 

router.options('/Incluir',  bodyParser.json(),cors()) // enable pre-flight request for DELETE 
router.post('/Incluir', Login.obrigatorio,cors(),jogosControllers.IncluirJogo)

router.options('/Alterar/:id', bodyParser.json(),cors())
router.put('/Alterar/:id', Login.obrigatorio, cors(), jogosControllers.AlterarJogo);

router.options('/Excluir/:id', bodyParser.json(),cors())
router.delete('/Excluir/:id', Login.obrigatorio, cors(),jogosControllers.ExcluirJogo);

module.exports = router;