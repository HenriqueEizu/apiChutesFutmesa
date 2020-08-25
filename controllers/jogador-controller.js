const mysql = require('mysql');
const config = require('../config');
const { timeout } = require('../apiChutesFutmesa/routes/config');

exports.GetAllJogador = (req,res) => {
    console.log(req.usuario);
    const connection = mysql.createConnection(config)
    strSql : String;
    strSql = "SELECT	JO.*, CL.CL_CLNOME, CL.CL_CLSIGLA, CL.CL_CLEMBLEMA "
    strSql = strSql + " FROM	JOGADOR JO "
    strSql = strSql + " JOIN	CLUBES CL ON JO.JO_CLID = CL.CL_CLID; "
    connection.query(strSql,( err, rows, fields) =>{
        connection.destroy();
        if (err) {return res.status(500).send({ error: err}) }
        if (rows.length < 1){ return res.status(401).send({ mensagem: 'Nenhum usuario encontrado'})}
        const response = {
            jogadores: rows.map(jo => {
                return {
                    JO_JOID: jo.JO_JOID,
                    JO_JONOME: jo.JO_JONOME,
                    JO_JOFOTO: jo.JO_JOFOTO,
                    JO_JOAPELIDO: jo.JO_JOAPELIDO,
                    JO_JOATIVO: jo.JO_JOATIVO,
                    US_CLID : jo.JO_CLID,
                    OBJ_CLUBE : {
                        CL_CLID : jo.US_CLID,
                        CL_CLNOME  : jo.CL_CLNOME,
                        CL_CLSIGLA  : jo.CL_CLSIGLA,
                        CL_CLEMBLEMA : jo.CL_CLEMBLEMA,
                    },
                    JO_JODATACADASTRO : jo.JO_JODATACADASTRO,
                    JO_JOMATRICULA : jo.JO_JOMATRICULA
                }
            })
        }
        return res.status(200).send(response.jogadores);
    }
    )
}

exports.VerificaNomeJogador = (req,res) => {
    strSql : String;
    var response = {jogadores: { nomeJogador: null,
                 apelidoJogador: null}
        }
    const connection = mysql.createConnection(config)
    strSql = "SELECT JO_JOAPELIDO, JO_JONOME, JO_JOMATRICULA FROM JOGADOR "
    connection.query(strSql,( err, rows, fields) =>{
        connection.destroy();
        if (err) {return res.status(500).send({ error: err}) }
        if (rows.length < 1){ return res.status(200).send({ response})}
            response = {
            jogadores: rows.map( jo => { 
                return { nomeJogador: jo.JO_JONOME,
                         apelidoJogador: jo.JO_JOAPELIDO,
                         matriculaJogador: jo.JO_JOMATRICULA}
            }) 
        }
        return res.status(200).send(response);
    })

}

exports.IncluirJogador = (req, res) => {
    strSql : String;
    blnAtivo : Boolean;
    if (req.body.JO_JOATIVO == ''){blnAtivo = false} else{blnAtivo = true}
    strSql = "INSERT INTO JOGADOR ( JO_JONOME,JO_JOFOTO,JO_JOAPELIDO,JO_JOATIVO, JO_CLID,JO_JODATACADASTRO, JO_JOMATRICULA) " ;
    strSql = strSql + " VALUES (?,?,?,?,?,?,?)" ;
    const connection = mysql.createConnection(config)
    connection.beginTransaction(function(err) {
        connection.query(strSql,[req.body.JO_JONOME,req.body.JO_JOFOTO,req.body.JO_JOAPELIDO
            ,blnAtivo,req.body.JO_CLID,req.body.JO_JODATACADASTRO, req.body.JO_JOMATRICULA],( err, results, fields) =>{
            console.log("passo 1");
            if (err) {
                connection.rollback();
                return false
            };
            strSql = " SELECT MAX(JO_JOID) AS JO_JOID FROM  JOGADOR "
            connection.query(strSql,( err, rows, fields) =>{
                console.log("passo 2");
                if (err) {
                    console.log(err + "erro passo 2")
                    connection.rollback();
                    return false
                };
                strSql = "INSERT INTO HISTORICOJOGADOR ( HJ_JOID,HJ_JOAPELIDO,HJ_JOATIVO,HJ_CLID,HJ_HJDATACADASTRO) " ;
                strSql = strSql + " VALUES (?,?,?,?,now())" ;
                console.log(rows[0].JO_JOID + "gggggggg")
                connection.query(strSql,[rows[0].JO_JOID,req.body.JO_JOAPELIDO,blnAtivo,req.body.JO_CLID],( err, rows, fields) =>{
                    console.log("passo 3");
                    if (err) {
                        console.log("erro no passo 3")
                        connection.rollback();
                        return false
                    };
                    console.log("Jogador inserido com sucesso");
                    res.end()
                    connection.commit();
                    // connection.destroy();
                    return true;
                })
            })
        })
    })
}

exports.GetIdJogador = (req,res) => {
    strSql : String;
    const connection = mysql.createConnection(config)
    strSql = "SELECT * FROM JOGADOR WHERE JO_JOID = ? "
    
    connection.query(strSql,[req.params.id],( err, rows, fields) =>{
        connection.destroy();
        if (err) {return res.status(500).send({ error: err}) }
        if (rows.length < 1){ return res.status(401).send({ mensagem: 'Nenhum jogador encontrado'})}
        const response = {
            JO_JOID: rows[0].JO_JOID,
            JO_JONOME: rows[0].JO_JONOME,
            JO_JOFOTO: rows[0].JO_JOFOTO,
            JO_JOAPELIDO: rows[0].JO_JOAPELIDO,
            JO_JOATIVO: rows[0].JO_JOATIVO,
            JO_CLID : rows[0].JO_CLID,
            US_USEMAIL : rows[0].US_USEMAIL,
            JO_JODATACADASTRO : rows[0].JO_JODATACADASTRO,
            JO_JOMATRICULA : rows[0].JO_JOMATRICULA
        }
        return res.status(200).send(response);
    })
}

exports.AlterarJogador = (req, res) => {
    strSql : String;
    blnAtivo : Boolean;
    if (req.body.JO_JOATIVO == ''){blnAtivo = false}else{blnAtivo = true}
    strSql = "UPDATE JOGADOR SET JO_JONOME = ? ,JO_JOFOTO = ? , JO_JOAPELIDO = ? ,JO_JOATIVO = ? ";
    strSql = strSql + ",JO_CLID = ? , JO_JODATACADASTRO = ?, JO_JOMATRICULA = ?" ;
    strSql = strSql + " WHERE JO_JOID = ? ";
    console.log(strSql + req.body.JO_JONOME);
    const connection = mysql.createConnection(config)
    connection.beginTransaction(function(err) {
        connection.query(strSql,[req.body.JO_JONOME,req.body.JO_JOFOTO,req.body.JO_JOAPELIDO,blnAtivo
                                ,req.body.JO_CLID,req.body.JO_JODATACADASTRO, req.body.JO_JOMATRICULA, req.body.JO_JOID],( err, results, fields) =>{
            if (err) {
                connection.rollback();
                return false
            };
            strSql = "INSERT INTO HISTORICOJOGADOR ( HJ_JOID,HJ_JOAPELIDO,HJ_JOATIVO,HJ_CLID,HJ_HJDATACADASTRO) " ;
            strSql = strSql + " VALUES (?,?,?,?, now())" ;
            connection.query(strSql,[req.body.JO_JOID,req.body.JO_JOAPELIDO,blnAtivo,req.body.JO_CLID],( err, rows, fields) =>{
                console.log("passo 2");
                if (err) {
                    console.log(err + "erro passo 2")
                    connection.rollback();
                    return false
                };
                if (err){return false}
                console.log("Jogador alterado com sucesso com o id:", results.insertedId)
                connection.commit();
                res.end()
                return true;
            })
        })
    })
}


