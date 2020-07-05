const express = require('express');
const router = express.Router();
const mysql = require('mysql');
let config = require('../config.js');
var cors = require('cors')
const Login = require('../middleware/login');
const equipeControllers = require('../controllers/equipe-controller');
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.options('/', cors()) // enable pre-flight request for DELETE 
router.get('/', Login.obrigatorio, cors(), equipeControllers.GetAllEquipes)

router.options('/RankingJogadorStatus', cors()) // enable pre-flight request for DELETE 
router.get('/RankingJogadorStatus', Login.obrigatorio, cors(), equipeControllers.RankingJogadorStatus)

router.options('/imagemEscudo', cors()) // enable pre-flight request for DELETE 
router.get('/imagemEscudo', Login.obrigatorio, cors(), equipeControllers.ImagemEscudos)

router.options('/Excluir/:id', bodyParser.json(),cors())
router.delete('/Excluir/:id', Login.obrigatorio, cors(),equipeControllers.ExcluirEquipe);

router.options('/Incluir', bodyParser.json(),cors())
router.post('/Incluir',Login.obrigatorio, cors(), equipeControllers.IncluirEquipe);

router.options('/Alterar/:id', bodyParser.json(),cors())
router.put('/Alterar/:id', Login.obrigatorio, cors(), equipeControllers.AlterarEquipe);

router.options('/upload', bodyParser.json(),cors())
router.post('/upload', Login.obrigatorio, equipeControllers.Upload); 

router.options('/GetEquipeId/:id', bodyParser.json(),cors())
router.get('/GetEquipeId/:id', Login.obrigatorio, cors(),equipeControllers.GetEquipeId);

router.post('/', (req, res, next) =>{
    res.status(201).send({
        mensagem: 'Clubes post'
    })
})
 
module.exports = router;