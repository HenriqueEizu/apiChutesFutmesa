const express = require('express');
const router = express.Router();
const mysql = require('mysql');
let config = require('../config.js');
var cors = require('cors')

router.options('/', cors()) // enable pre-flight request for DELETE 
router.get('/',cors(),(req,res) => {
    console.log("Fetching user with id: " + req.params.id)
    const connection = mysql.createConnection(config)
    connection.query("SELECT * FROM GRUPOUSUARIO",( err, rows, fields) =>{
        if (err) {
            console.log("Failed to query for users:" + err)
            res.sendStatus(500)
            // throw err
            connection.destroy();
            return
        }
        console.log("I think we fetched users successfully")
        res.json(rows)
        connection.destroy();
    })
    // res.end();
})

module.exports = router;