const express = require('express');
const router = express.Router();
const mysql = require('mysql');
let config = require('./config.js');
var cors = require('cors')
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


router.options('/Incluir', bodyParser.json(),cors()) // enable pre-flight request for DELETE 
router.post('/Incluir', cors(),(req, res) => {
    strSql : String;
    blnAtivo : Boolean;

    strSql = "SELECT count(*) as total FROM USUARIO WHERE US_USLOGIN = ? "
    const connection = mysql.createConnection(config);
    connection.query(strSql,[req.body.US_USLOGIN],( err, rows, fields) =>{
        if (err) {
            console.log("Failed to query for users:" + err)
            res.sendStatus(500)
            // throw err
            connection.destroy();
            return
        }
        console.log("I think we fetched users successfully")

        if (rows[0].total > 0){
            res.end("Usuário + -" + req.body.US_USLOGIN + "- já existe na base de dados");
            connection.destroy();
            return false; 
        }
        else{
            if (req.body.US_USATIVO == ''){
                blnAtivo = false
            }
            else{
                blnAtivo = true
            }
            bcrypt.hash(req.body.US_USSENHA, 10, (errBcrypt, hash) => {
                if (errBcrypt) {return res.status(500).send({ error: errBcrypt})}
                console.log("passou aqui")
                strSql = "INSERT INTO USUARIO (US_USLOGIN,US_USATIVO,US_CLID,US_GUID,US_USEMAIL,US_USNOMETRATAMENTO,US_USDATACADASTRO,US_USSENHA) "
                strSql = strSql + " VALUES (?,?,?,?,?,?,?,?)" ;
                console.log(hash);
                // const connection = mysql.createConnection(config)
                connection.query(strSql,[req.body.US_USLOGIN,blnAtivo,req.body.US_CLID,req.body.US_GUID
                    ,req.body.US_USEMAIL,req.body.US_USNOMETRATAMENTO,req.body.US_USDATACADASTRO
                    , hash ],( err, results, fields) =>{
                    if (err){
                        console.log(err)
                        res.end(err)
                        return false
                    }
                    console.log("first:" + req.body)
                    // res.end("Usuário inserido com sucesso");
                    res.end();
                    connection.destroy();
                    return true;
                })
                
            });
        }
        
    })


    
})

// router.options('/usuario/:id', cors()) // enable pre-flight request for DELETE 
router.options('/', cors()) // enable pre-flight request for DELETE 
router.post('/',cors(),(req,res) => {
    strSql : String;
    console.log("Fetching user with id: " + req.body.id)
    const connection = mysql.createConnection(config)
    strSql = "SELECT * FROM USUARIO WHERE US_USLOGIN = ? AND US_USSENHA = ? "
    
    connection.query(strSql,[req.body.US_USLOGIN,req.body.US_USSENHA],( err, rows, fields) =>{

        if (err) {
            console.log("Failed to query for users:" + err)
            res.sendStatus(500)
            // throw err
            connection.destroy();
            return
        }
        console.log("I think we fetched users successfully")
        res.json(rows[0])
        connection.destroy();
    })

})

router.options('/verificaLogin/:id', cors()) // enable pre-flight request for DELETE 
router.get('/verificaLogin/:id',cors(),(req,res) => {
    strSql : String;
    console.log("Fetching user with id: " + req.params.id)
    const connection = mysql.createConnection(config)
    strSql = "SELECT * FROM USUARIO WHERE US_USLOGIN = ? "
    
    connection.query(strSql,[req.params.id],( err, rows, fields) =>{
        if (err) {
            console.log("Failed to query for users:" + err)
            res.sendStatus(500)
            // throw err
            connection.destroy();
            return
        }
        else{
            if (!rows.length){
                console.log("não encontrou") 
                res.json();
                connection.destroy();
            }else{
                console.log("encontrou")
                console.log(rows)
                // console.log(fields)
                res.json(rows[0])
                connection.destroy();
            }
            
        }
    })

})

module.exports = router;