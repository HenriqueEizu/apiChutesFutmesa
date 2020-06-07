const mysql = require('mysql');
const config = require('../config');

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
                    JO_JODATACADASTRO : jo.JO_JODATACADASTRO
                }
            })
        }
        return res.status(200).send(response.jogadores);
    }
)}

exports.VerificaNomeJogador = (req,res) => {
    strSql : String;
    var response = {jogadores: { nomeJogador: null,
                 apelidoJogador: null}
        }
    const connection = mysql.createConnection(config)
    strSql = "SELECT JO_JOAPELIDO, JO_JONOME FROM JOGADOR "
    connection.query(strSql,( err, rows, fields) =>{
        connection.destroy();
        if (err) {return res.status(500).send({ error: err}) }
        if (rows.length < 1){ return res.status(200).send({ response})}
            response = {
            jogadores: rows.map( jo => { 
                return { nomeJogador: jo.JO_JONOME,
                         apelidoJogador: jo.JO_JOAPELIDO}
            })
        }
        return res.status(200).send(response);
    })

}

exports.IncluirJogador = (req, res) => {
    strSql : String;
    blnAtivo : Boolean;
    if (req.body.JO_JOATIVO == ''){blnAtivo = false} else{blnAtivo = true}
    strSql = "INSERT INTO Jogador ( JO_JONOME,JO_JOFOTO,JO_JOAPELIDO,JO_JOATIVO, JO_CLID,JO_JODATACADASTRO) " ;
    strSql = strSql + " VALUES (?,?,?,?,?,?)" ;
    const connection = mysql.createConnection(config)
    connection.beginTransaction(function(err) {
        connection.query(strSql,[req.body.JO_JONOME,req.body.JO_JOFOTO,req.body.JO_JOAPELIDO
            ,blnAtivo,req.body.JO_CLID,req.body.JO_JODATACADASTRO],( err, results, fields) =>{
            console.log("passo 1");
            if (err) {
                connection.rollback();
                return false
            };
            strSql = " SELECT MAX(JO_JOID) AS JO_JOID FROM  Jogador "
            connection.query(strSql,( err, rows, fields) =>{
                console.log("passo 2");
                if (err) {
                    console.log(err + "erro passo 2")
                    connection.rollback();
                    return false
                };
                strSql = "INSERT INTO HistoricoJogador ( HJ_JOID,HJ_JOAPELIDO,HJ_JOATIVO,HJ_CLID,HJ_HJDATACADASTRO) " ;
                strSql = strSql + " VALUES (?,?,?,?,?)" ;
                console.log(rows[0].JO_JOID + "gggggggg")
                connection.query(strSql,[rows[0].JO_JOID,req.body.JO_JOAPELIDO,blnAtivo,req.body.JO_CLID,req.body.JO_JODATACADASTRO],( err, rows, fields) =>{
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

