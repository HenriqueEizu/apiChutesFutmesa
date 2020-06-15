const mysql = require('mysql');
const config = require('../config');

exports.GetAllCategoriaJogo = (req,res) => {
    console.log(req.usuario);
    const connection = mysql.createConnection(config)
    connection.query("SELECT * FROM CATEGORIAJOGO",( err, rows, fields) =>{
        if (err) {return res.status(500).send({ error: err}) }
        res.json(rows)
        connection.destroy();
    }
)}