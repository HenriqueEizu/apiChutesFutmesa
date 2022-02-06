const mysql = require('mysql');
const config = require('../config');

exports.InserirInscricao = (req, res) => {
    strSql = "DELETE FROM INSCRICAOCOMPETICAO WHERE  IS_CLID = ? AND IS_CPID = ? " ;
    console.log("*******************************************************")
    console.log(req.body[0])
    console.log("*******************************************************")
    const connection = mysql.createConnection(config);
    connection.beginTransaction(function(err) {
        connection.query(strSql,[req.body[0].IS_CLID,req.body[0].IS_CPID],( err, rows, fields) =>{
            console.log("passo 1");
                if (err) {
                    connection.rollback();
                    return false
                };
            // setTimeout(function() {
                for (i = 0; i <= req.body.length -1 ; i++){
                    console.log("*******************************************************")
                    console.log(req.body[i])
                    console.log("*******************************************************")
                    if (req.body[i] != null){
                        strSql = "INSERT INTO INSCRICAOCOMPETICAO ( IS_JOID,IS_CPID,IS_ISDATACADASTRO, IS_CLID) " ;
                        strSql = strSql + " VALUES (?,?,?,?)" ;
                        connection.query(strSql,[req.body[i].IS_JOID,req.body[i].IS_CPID,req.body[i].IS_ISDATACADASTRO,req.body[i].IS_CLID],( err, rows, fields) =>{
                            console.log("passo 3");
                            if (err) {
                                console.log("erro no passo 3")
                                console.log(err)
                                connection.rollback();
                                return false
                            };
                            
                        })
                    }
                }
            // }, 4000);
            console.log("Jogadores inscritos com sucesso");
            connection.commit();
            //connection.destroy();
            res.end()
            return true;
            
        })
    })
    setTimeout(function() {connection.destroy()}, 12000);
    //connection.destroy();
    
}

exports.GetInscricaoClube = (req,res) => {

    const connection = mysql.createConnection(config)
    strSql : String;
    strSql = "SELECT  IC.IS_ISID, IC.IS_CLID,JO.JO_JOID, JO.JO_JONOME, JO.JO_JOFOTO, JO.JO_JOAPELIDO,JO.JO_JOATIVO , JO.JO_CLID, "
    strSql = strSql + " CP.CP_CPID, CP.CP_CPDESCRICAO, CP.CP_CPCIDADE, CP.CP_ROID "
    strSql = strSql + " FROM	INSCRICAOCOMPETICAO IC "
    strSql = strSql + " JOIN	JOGADOR JO ON (IC.IS_JOID = JO.JO_JOID) "
    strSql = strSql + " JOIN	COMPETICOES CP ON (CP.CP_CPID = IC.IS_CPID) "
    strSql = strSql + " WHERE   CP.CP_CPID = ? "
    //strSql = strSql + " AND	    JO.JO_CLID = ? "
    
    connection.query(strSql,[req.params.id],( err, rows, fields) =>{
        if (rows == undefined){ return res.status(200).send()}
        connection.destroy();
        const response = {
            inscricoes: rows.map(jo => {
                return {
                    IS_ISID : jo.IS_ISID,
                    IS_JOID : jo.JO_JOID,
                    IS_CPID : jo.CP_CPID,
                    IS_ISDATACADASTRO : jo.IS_ISDATACADASTRO,
                    IS_CLID : jo.IS_CLID,
                    OBJ_JOGADOR : {
                        JO_JOID: jo.JO_JOID,
                        JO_JONOME: jo.JO_JONOME,
                        JO_JOFOTO: jo.JO_JOFOTO,
                        JO_JOAPELIDO: jo.JO_JOAPELIDO,
                        JO_JOATIVO: jo.JO_JOATIVO,
                        JO_CLID : jo.JO_CLID,
                        JO_CLID : jo.JO_CLID,
                        JO_JOINSCRITO : false
                    },
                    OBJ_COMPETICAO : {
                        CP_CPID : jo.CP_CPID,
                        CP_CPDESCRICAO : jo.CP_CPDESCRICAO,
                        CP_CPCIDADE : jo.CP_CPCIDADE,
                        CP_ROID : jo.CP_ROID
                    },
                }
            })
        }
        return res.status(200).send(response.inscricoes);
    }
    )
}

