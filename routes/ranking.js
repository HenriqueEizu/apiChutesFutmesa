const express = require('express');
const router = express.Router();
const mysql = require('mysql');
let config = require('../config.js');
var cors = require('cors')
const Login = require('../middleware/login');
const rankingControllers = require('../controllers/ranking-controller');
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.options('/ImportarRanking', bodyParser.json(),cors())
router.post('/ImportarRanking', Login.obrigatorio, cors(),rankingControllers.ImportarRanking);

router.options('/OsMaisEscalados', bodyParser.json(),cors())
router.get('/OsMaisEscalados', Login.obrigatorio, cors(),rankingControllers.OsMaisEscalados);

router.options('/OsSeusEscalados/:id', bodyParser.json(),cors())
router.get('/OsSeusEscalados/:id', Login.obrigatorio, cors(),rankingControllers.OsSeusEscalados);


router.post('/', (req, res, next) =>{
    res.status(201).send({
        mensagem: 'Clubes post'
    })
})

module.exports = router;