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

router.options('/VerificaEquipe', cors()) // enable pre-flight request for DELETE 
router.get('/VerificaEquipe', Login.obrigatorio, cors(),equipeControllers.VerificaEquipe);

router.options('/RankingJogadorStatus/:id', cors()) // enable pre-flight request for DELETE 
router.get('/RankingJogadorStatus/:id', Login.obrigatorio, cors(), equipeControllers.RankingJogadorStatus)

router.options('/GetRankingEquipes', cors()) // enable pre-flight request for DELETE 
router.get('/GetRankingEquipes', Login.obrigatorio, cors(), equipeControllers.RankingEquipes)

router.options('/PontuacaoUltimaRodada', cors()) // enable pre-flight request for DELETE 
router.get('/PontuacaoUltimaRodada', Login.obrigatorio, cors(), equipeControllers.PontuacaoUltimaRodada)

router.options('/imagemEscudo', cors()) // enable pre-flight request for DELETE 
router.get('/imagemEscudo', Login.obrigatorio, cors(), equipeControllers.ImagemEscudos)

router.options('/Excluir/:id', bodyParser.json(),cors())
router.delete('/Excluir/:id', Login.obrigatorio, cors(),equipeControllers.ExcluirEquipe);

router.options('/Incluir', bodyParser.json(),cors())
router.put('/Incluir',Login.obrigatorio, cors(), equipeControllers.IncluirEquipe);

router.options('/Alterar', bodyParser.json(),cors())
router.put('/Alterar', Login.obrigatorio, cors(), equipeControllers.AlterarEquipe);

router.options('/GetEquipeId/:id', bodyParser.json(),cors())
router.get('/GetEquipeId/:id', Login.obrigatorio, cors(),equipeControllers.GetEquipeId);

router.options('/GetEquipeIdPorusuario/:id', bodyParser.json(),cors())
router.get('/GetEquipeIdPorusuario/:id', Login.obrigatorio, cors(),equipeControllers.GetEquipeIdPorusuario);

router.options('/DiasFechaMercado', cors()) // enable pre-flight request for DELETE 
router.get('/DiasFechaMercado', Login.obrigatorio, cors(), equipeControllers.DiasFechaMercado)

router.options('/Mercadofechado', cors()) // enable pre-flight request for DELETE 
router.get('/Mercadofechado', Login.obrigatorio, cors(), equipeControllers.Mercadofechado)

router.post('/', (req, res, next) =>{
    res.status(201).send({
        mensagem: 'Clubes post'
    })
})
 
module.exports = router;