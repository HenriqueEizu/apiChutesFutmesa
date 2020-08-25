const express = require('express');
const router = express.Router();
const mysql = require('mysql');
let config = require('../config.js');
var cors = require('cors')
const Login = require('../middleware/login');
const equipeJogadorControllers = require('../controllers/equipejogador-controller');
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.options('/existeEquipeUsuario/:id', bodyParser.json(),cors())
router.get('/existeEquipeUsuario/:id', Login.obrigatorio, cors(),equipeJogadorControllers.ExisteEquipeUsuario);

router.options('/getEquipeJogadorId/:id', bodyParser.json(),cors())
router.get('/getEquipeJogadorId/:id', Login.obrigatorio, cors(),equipeJogadorControllers.GetEquipeJogadorId);

router.options('/SalvarEquipeEscalacao/:id', bodyParser.json(),cors())
router.put('/SalvarEquipeEscalacao/:id', Login.obrigatorio, cors(), equipeJogadorControllers.SalvarEquipeEscalacao);

router.options('/ExcluirEquipeEscalacao/:id', bodyParser.json(),cors())
router.delete('/ExcluirEquipeEscalacao/:id', Login.obrigatorio, cors(),equipeJogadorControllers.ExcluirEquipeEscalacao);




router.post('/', (req, res, next) =>{
    res.status(201).send({
        mensagem: 'Clubes post'
    })
})

module.exports = router;