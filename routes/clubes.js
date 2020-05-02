const express = require('express');
const router = express.Router();
const mysql = require('mysql');
let config = require('./config.js');
var cors = require('cors')


router.options('/', cors()) // enable pre-flight request for DELETE 
router.get('/',cors(),(req,res) => {
    const connection = mysql.createConnection(config)
    connection.query("SELECT * FROM Clubes",( err, rows, fields) =>{
        if (err) {
            console.log("Failed to query for users:" + err)
            res.sendStatus(500)
            // throw err
            connection.destroy();
            return
        }
        console.log("I think we fetched users successfully" + rows[5].CL_CLNOME )
        res.json(rows)
        connection.destroy();
    })
    // res.end();
})

// router.get('/',(req, res, next) =>{
    // const clube = {
    //     id : req.body.id,
    //     desc : req.body.desc
    // }
     // const response = {
        // clubes: response.map(prod => {

        // cl_clid: prod.cl_clid})
    //     id : req.body.id,
    //     desc : req.body.desc
    // }
    // res.status(200).send({
    //     mensagem: 'Clubes ativo'
    //     // clubeCriado: clube
//     });
// });

router.post('/', (req, res, next) =>{
    res.status(201).send({
        mensagem: 'Clubes post'
    })
})

module.exports = router;