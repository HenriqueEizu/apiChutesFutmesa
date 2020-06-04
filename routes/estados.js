const express = require('express');
const router = express.Router();
const mysql = require('mysql');
let config = require('../config.js');
var cors = require('cors')
const estadosControllers = require('../controllers/estado-controller');

router.options('/', cors()) // enable pre-flight request for DELETE 
router.get('/', cors(), estadosControllers.GetAllEstados)

router.post('/', (req, res, next) =>{
    res.status(201).send({
        mensagem: 'Clubes post'
    })
})

module.exports = router;