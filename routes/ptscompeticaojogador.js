const express = require('express');
const router = express.Router();
const mysql = require('mysql');
let config = require('../config.js');
var cors = require('cors')
const Login = require('../middleware/login');
const ptscompeticaojogadorControllers = require('../controllers/ptscompeticaojogador-controller');
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.options('/', cors()) // enable pre-flight request for DELETE 
router.get('/', Login.obrigatorio, cors(), ptscompeticaojogadorControllers.GetAllPtsCompeticoesJogadores)
 
router.options('/Excluir/:id', bodyParser.json(),cors())
router.delete('/Excluir/:id', Login.obrigatorio, cors(),ptscompeticaojogadorControllers.ExcluirPtsCompeticaoJogador);

router.options('/Incluir', bodyParser.json(),cors())
router.post('/Incluir',Login.obrigatorio, cors(), ptscompeticaojogadorControllers.IncluirPtsCompeticaoJogador);

router.options('/Alterar/:id', bodyParser.json(),cors())
router.put('/Alterar/:id', Login.obrigatorio, cors(), ptscompeticaojogadorControllers.AlterarPtsCompeticaoJogador);

router.options('/GetPtsCompeticaoJogadorId/:id', bodyParser.json(),cors())
router.get('/GetPtsCompeticaoJogadorId/:id', Login.obrigatorio, cors(),ptscompeticaojogadorControllers.GetPtsCompeticaoJogadorId);

router.post('/', (req, res, next) =>{
    res.status(201).send({
        mensagem: 'Clubes post'
    })
})

module.exports = router;