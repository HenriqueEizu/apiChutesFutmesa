const express = require('express');
const router = express.Router();
const mysql = require('mysql');
let config = require('../config.js');
var cors = require('cors')
const Login = require('../middleware/login');

const clubesControllers = require('../controllers/clube-controller');
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.options('/', cors()) // enable pre-flight request for DELETE 
router.get('/', Login.obrigatorio, cors(), clubesControllers.GetAllClubes)

router.options('/VerificaClube', cors()) // enable pre-flight request for DELETE 
router.get('/VerificaClube', Login.obrigatorio, cors(),clubesControllers.VerificaClube);

router.options('/Excluir/:id', bodyParser.json(),cors())
router.delete('/Excluir/:id', Login.obrigatorio, cors(),clubesControllers.ExcluirClube);

router.options('/Incluir', bodyParser.json(),cors())
router.post('/Incluir',Login.obrigatorio, cors(), clubesControllers.IncluirClube);

router.options('/Alterar/:id', bodyParser.json(),cors())
router.put('/Alterar/:id', Login.obrigatorio, cors(), clubesControllers.AlterarClube);

router.options('/upload', bodyParser.json(),cors())
router.post('/upload', Login.obrigatorio, clubesControllers.Upload); 

router.options('/GetClubeId/:id', bodyParser.json(),cors())
router.get('/GetClubeId/:id', Login.obrigatorio, cors(),clubesControllers.GetClubeId);

router.post('/', (req, res, next) =>{
    res.status(201).send({
        mensagem: 'Clubes post'
    })
})

module.exports = router;