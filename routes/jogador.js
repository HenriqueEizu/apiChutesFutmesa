const express = require('express');
const router = express.Router();
const mysql = require('mysql');
let config = require('../config.js');
var cors = require('cors')
const Login = require('../middleware/login');
const jogadorControllers = require('../controllers/jogador-controller');
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.options('/', cors()) // enable pre-flight request for DELETE 
router.get('/', Login.obrigatorio, cors(), jogadorControllers.GetAllJogador)

router.options('/VerificaNomeJogador', cors()) // enable pre-flight request for DELETE 
router.get('/VerificaNomeJogador', Login.obrigatorio, cors(),jogadorControllers.VerificaNomeJogador);

router.options('/Incluir',  bodyParser.json(),cors()) // enable pre-flight request for DELETE 
router.post('/Incluir', Login.obrigatorio,cors(),jogadorControllers.IncluirJogador)

module.exports = router;