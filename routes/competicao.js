const express = require('express');
const router = express.Router();
const mysql = require('mysql');
let config = require('../config.js');
var cors = require('cors')
const Login = require('../middleware/login');
const competicaoControllers = require('../controllers/competicao-controller');
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.options('/', cors()) // enable pre-flight request for DELETE 
router.get('/', Login.obrigatorio, cors(), competicaoControllers.GetAllCompeticoes)

router.options('/GetAnoCompeticao', cors()) // enable pre-flight request for DELETE 
router.get('/GetAnoCompeticao', Login.obrigatorio, cors(), competicaoControllers.GetAnoCompeticao)

router.options('/Excluir/:id', bodyParser.json(),cors())
router.delete('/Excluir/:id', Login.obrigatorio, cors(),competicaoControllers.ExcluirCompeticao);

router.options('/Incluir', bodyParser.json(),cors())
router.post('/Incluir',Login.obrigatorio, cors(), competicaoControllers.IncluirCompeticao);

router.options('/Alterar/:id', bodyParser.json(),cors())
router.put('/Alterar/:id', Login.obrigatorio, cors(), competicaoControllers.AlterarCompeticao);

router.options('/upload', bodyParser.json(),cors())
router.post('/upload', Login.obrigatorio, competicaoControllers.Upload); 

router.options('/GetCompeticaoId/:id', bodyParser.json(),cors())
router.get('/GetCompeticaoId/:id', Login.obrigatorio, cors(),competicaoControllers.GetCompeticaoId);

router.post('/', (req, res, next) =>{
    res.status(201).send({
        mensagem: 'Clubes post'
    })
})
 
module.exports = router;