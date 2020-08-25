const mysql = require('mysql');
const config = require('../config');

exports.ExisteEquipeUsuario = (req, res) => {
    strSql : String;
    const connection = mysql.createConnection(config);

    strSql = " SELECT EJ_EJID, EJ_EQID,EJ_JOID,EJ_EJOBSERVACAO,EJ_EJATIVO,EJ_EJDATACADASTRO "
    strSql = " FROM EQUIPESJOGADOR WHERE EJ_EQID = ?  "
    console.log(strSql);
    connection.query(strSql,[req.params.id],( err, results, fields) =>{
        connection.destroy();
        if (err) {return res.status(500).send({ error: err}) };
        if (rows.length < 1){ 
            const responseNull = {
                EJ_EJID : null,
                EJ_EQID  : null,
                EJ_JOID    : null,
                EJ_EJOBSERVACAO : null,
                EJ_EJATIVO : null,
                EJ_EJDATACADASTRO : null,
            }
            return res.status(200).send(responseNull);
        }
        const response = {
            EJ_EJID : rows[0].EJ_EJID,
            EJ_EQID  : rows[0].EJ_EQID,
            EJ_JOID    : rows[0].EJ_JOID,
            EJ_EJOBSERVACAO : rows[0].EJ_EJOBSERVACAO,
            EJ_EJATIVO : rows[0].EJ_EJATIVO,
            EJ_EJDATACADASTRO : rows[0].EJ_EJDATACADASTRO,
        }
        return res.status(200).send(response);
    })
}

exports.GetEquipeJogadorId = (req, res) => {
    strSql : String;
    const connection = mysql.createConnection(config);

    strSql = " SELECT EJ_EJID, EJ_EQID,EJ_JOID,EJ_EJOBSERVACAO,EJ_EJATIVO,EJ_EJDATACADASTRO "
    strSql = " FROM EQUIPESJOGADOR WHERE EJ_EJID = ?  "
    console.log(strSql);
    connection.query(strSql,[req.params.id],( err, results, fields) =>{
        connection.destroy();
        if (err) {return res.status(500).send({ error: err}) };
        if (rows.length < 1){ 
            const responseNull = {
                EJ_EJID : null,
                EJ_EQID  : null,
                EJ_JOID    : null,
                EJ_EJOBSERVACAO : null,
                EJ_EJATIVO : null,
                EJ_EJDATACADASTRO : null,
            }
            return res.status(200).send(responseNull);
        }
        const response = {
            EJ_EJID : rows[0].EJ_EJID,
            EJ_EQID  : rows[0].EJ_EQID,
            EJ_JOID    : rows[0].EJ_JOID,
            EJ_EJOBSERVACAO : rows[0].EJ_EJOBSERVACAO,
            EJ_EJATIVO : rows[0].EJ_EJATIVO,
            EJ_EJDATACADASTRO : rows[0].EJ_EJDATACADASTRO,
        }
        return res.status(200).send(response);
    })
}

exports.SalvarEquipeEscalacao = (req, res) => {
    strSql : String;
    strJogadores : String;
    strJogadores = req.params.id;
    var idJogadores = strJogadores.split(",");
    i : Number;
    const connection = mysql.createConnection(config);
    connection.beginTransaction(function(err) {
        strSql = "DELETE FROM EQUIPESJOGADOR WHERE EJ_EQID = ?"
        connection.query(strSql,[req.body.EQ_EQID],( err, results, fields) =>{
            if (err) {connection.rollback();return res.status(500).send({ error: err}) }
            for(i = 0; i<= idJogadores.length -1 ; i++){
                strSql = "INSERT INTO EQUIPESJOGADOR (EJ_EQID,EJ_JOID,EJ_EJOBSERVACAO,EJ_EJATIVO,EJ_EJDATACADASTRO) "
                strSql = strSql + " VALUES (?," + idJogadores[i] + ",null,1,Now()) ;" ;
                console.log(strSql);
                connection.query(strSql,[req.body.EQ_EQID],( err, results, fields) =>{
                    if (err) {connection.rollback();return res.status(500).send({ error: err}) }
                    // connection.destroy();
                    console.log (i + "kkkk" + (idJogadores.length -2))
                    if ( i == idJogadores.length ){
                        connection.commit();
                        res.end()
                    }
                })
            }
        })
    })
}

exports.ExcluirEquipeEscalacao = (req, res) => {
    strSql : String;
    const connection = mysql.createConnection(config);
    strSql = "DELETE FROM EQUIPESJOGADOR WHERE EJ_EQID = ?"
    connection.query(strSql,[req.params.id],( err, results, fields) =>{
        connection.destroy();
        if (err) {connection.rollback();return res.status(500).send({ error: err}) }
        res.end()
    })
}
