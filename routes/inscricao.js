const express = require('express');
const router = express.Router();
const mysql = require('mysql');
let config = require('../config.js');
var cors = require('cors')
const Login = require('../middleware/login');
const inscricaoControllers = require('../controllers/inscricao-controller');
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.options('/InserirInscricao', cors()) // enable pre-flight request for DELETE 
router.post('/InserirInscricao', Login.obrigatorio, cors(), inscricaoControllers.InserirInscricao)

router.options('/GetInscricaoClube/:id', cors()) // enable pre-flight request for DELETE 
router.get('/GetInscricaoClube/:id',Login.obrigatorio, cors(), inscricaoControllers.GetInscricaoClube)

module.exports = router;