const mysql = require('mysql');
const config = require('../config');

exports.GetAllEstados = (req,res) => {
    const connection = mysql.createConnection(config)
    connection.query("SELECT * FROM estados order by uf_ufnome asc ",( err, rows, fields) =>{
        connection.destroy();
        if (err) {return res.status(500).send({ error: err}) }
        if (rows.length < 1){ return res.status(401).send({ mensagem: 'Falha na consulta - Nenhum estado cadastrado'})}
        res.json(rows);
    })
}