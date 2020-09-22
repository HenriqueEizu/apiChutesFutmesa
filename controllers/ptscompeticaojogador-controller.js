const mysql = require('mysql');
const config = require('../config');
const { json } = require('body-parser');

exports.GetAllPtsCompeticoesJogadores = (req,res) => {
    console.log(req.usuario);
    const connection = mysql.createConnection(config)
    strSql : String;
    strSql = "SELECT	PJ.*, JO.JO_JOAPELIDO, JO.JO_JOFOTO, JO.JO_JONOME, CP.CP_CPDESCRICAO ,CP.CP_CPFOTO, "
    strSql = strSql + " CL.CL_CLID, CL.CL_CLNOME, RO.RO_ROID, RO.RO_RODESCRICAO "
    strSql = strSql + " FROM	PTSCOMPETICOESJOGADORES PJ "
    strSql = strSql + " JOIN	COMPETICOES CP ON CP.CP_CPID = PJ.PJ_CPID "
    strSql = strSql + " JOIN	JOGADOR JO ON JO.JO_JOID = PJ.PJ_JOID "
    strSql = strSql + " JOIN	CLUBES CL ON CL.CL_CLID = JO.JO_CLID "
    strSql = strSql + " JOIN	RODADAS RO ON RO.RO_ROID = CP.CP_ROID "
    connection.query(strSql,( err, rows, fields) =>{
        console.log(strSql);
        connection.destroy();
        if (err) {return res.status(500).send({ error: err}) }
        if (rows.length < 1){ return res.status(401).send({ mensagem: 'Nenhum usuario encontrado'})}
        const response = {
            competicoes: rows.map(pj => {
                return {
                    PJ_PJID : pj.PJ_PJID,
                    PJ_CPID : pj.PJ_CPID,
                    OBJ_COMPETICAO : {
                        CP_CPDESCRICAO : pj.CP_CPDESCRICAO,
                        CP_CPFOTO : pj.CP_CPFOTO,
                        OBJ_Rodada : {
                            RO_ROID : pj.RO_ROID,
                            RO_RODESCRICAO : pj.RO_RODESCRICAO
                        }
                    },
                    PJ_JOID : pj.PJ_JOID,
                    OBJ_JOGADOR : {
                        JO_JOAPELIDO : pj.JO_JOAPELIDO,
                        JO_JOFOTO : pj.JO_JOFOTO,
                        JO_JONOME : pj.JO_JONOME,
                        OBJ_CLUBE : {
                            CL_CLID : pj.CL_CLID,
                            CL_CLNOME : pj.CL_CLNOME
                        }
                    },
                    PJ_JOMATRICULA : pj.PJ_JOMATRICULA,
                    PJ_PJCOLOCACAO : pj.PJ_PJCOLOCACAO,
                    PJ_PJPONTOSGANHOS : pj.PJ_PJPONTOSGANHOS,
                    PJ_PJJOGOS : pj.PJ_PJJOGOS,
                    PJ_PJVITORIAS : pj.PJ_PJVITORIAS,
                    PJ_PJEMPATE : pj.PJ_PJEMPATE,
                    PJ_PJDERROTA : pj.PJ_PJDERROTA,
                    PJ_PJGOLSPRO : pj.PJ_PJGOLSPRO,
                    PJ_PJGOLCONTRA : pj.PJ_PJGOLCONTRA,
                    PJ_PJSALDOGOLS : pj.PJ_PJSALDOGOLS,
                    PJ_PJPONTOS : pj.PJ_PJPONTOS,
                    PJ_PJOBSERVACAO : pj.PJ_PJOBSERVACAO,
                    PJ_PJATIVO : pj.PJ_PJATIVO,
                    PJ_PJDATACADASTRO : pj.PJ_PJDATACADASTRO,
                }
            })
        }
        return res.status(200).send(response.competicoes);
    }
)}

exports.TopPontuadores = (req,res) => {
    console.log(req.usuario);
    const connection = mysql.createConnection(config)
    strSql : String;

    strSql =    "SELECT	JO.JO_JOAPELIDO, 				JO.JO_JOFOTO, 				CL.CL_CLSIGLA, 					CL.CL_CLEMBLEMA, "
    strSql +=   "       JO.JO_JOID,                     CL.CL_CLID,                 PJ.PJ_JOMATRICULA, "
	strSql += 	"       SUM(PJ_PJPONTOSGANHOS) AS PG,	SUM(PJ_PJJOGOS) AS JG,      SUM(PJ_PJVITORIAS) AS V,		SUM(PJ_PJEMPATE) AS E, "
    strSql += 	"       SUM(PJ_PJDERROTA)AS D,			SUM(PJ_PJGOLSPRO) AS GP,	SUM(PJ_PJGOLCONTRA) AS GC,		SUM(PJ_PJSALDOGOLS) AS SG, "
    strSql += 	"       SUM(PJ_PJPONTOS) AS TOTAL,      MAX(CP.CP_CPDATAINICIO) AS CP_CPDATAINICIO "
    strSql += 	"       FROM	futmesacartola.PTSCOMPETICOESJOGADORES PJ "
    strSql +=   "       JOIN futmesacartola.COMPETICOES CP ON PJ.PJ_CPID = CP.CP_CPID "
    strSql += 	"       JOIN	futmesacartola.jogador JO ON PJ.PJ_JOID = JO.JO_JOID "
    strSql += 	"       JOIN	futmesacartola.clubes CL ON JO.JO_CLID = CL.CL_CLID "
    strSql += 	"       GROUP BY JO.JO_JOAPELIDO,JO.JO_JOFOTO,CL.CL_CLSIGLA,CL.CL_CLEMBLEMA,JO.JO_JOID,CL.CL_CLID,PJ.PJ_JOMATRICULA "
    strSql += 	"       ORDER BY SUM(PJ_PJPONTOS) DESC "
    connection.query(strSql,( err, rows, fields) =>{
        console.log(strSql);
        connection.destroy();
        if (err) {return res.status(500).send({ error: err}) }
        if (rows.length < 1){ return res.status(401).send({ mensagem: 'Nenhum usuario encontrado'})}
        const response = {
            competicoes: rows.map(pj => {
                return {
                    PJ_PJID : null,
                    PJ_CPID : null,
                    OBJ_COMPETICAO : {
                        CP_CPDATAINICIO : pj.CP_CPDATAINICIO,
                    },
                    PJ_JOID : pj.JO_JOID,
                    OBJ_JOGADOR : {
                        JO_JOAPELIDO : pj.JO_JOAPELIDO,
                        JO_JOFOTO : pj.JO_JOFOTO,
                        OBJ_CLUBE : {
                            CL_CLID : pj.CL_CLID,
                            CL_CLSIGLA : pj.CL_CLSIGLA,
                            CL_CLEMBLEMA : pj.CL_CLEMBLEMA
                        }
                    },
                    PJ_JOMATRICULA : pj.PJ_JOMATRICULA,
                    PJ_PJCOLOCACAO : null,
                    PJ_PJPONTOSGANHOS : pj.PG,
                    PJ_PJJOGOS : pj.JG,
                    PJ_PJVITORIAS : pj.V,
                    PJ_PJEMPATE : pj.E,
                    PJ_PJDERROTA : pj.D,
                    PJ_PJGOLSPRO : pj.GP,
                    PJ_PJGOLCONTRA : pj.GC,
                    PJ_PJSALDOGOLS : pj.SG,
                    PJ_PJPONTOS : pj.TOTAL,
                    PJ_PJOBSERVACAO : null,
                    PJ_PJATIVO : null,
                    PJ_PJDATACADASTRO : null,
                }
            })
        }
        return res.status(200).send(response.competicoes);
    }
)}

exports.ExcluirPtsCompeticaoJogador = (req, res) => {
    strSql : String;
    blnAtivo : Boolean;
    strSql = "DELETE FROM PTSCOMPETICOESJOGADORES WHERE PJ_PJID = ? ";
    console.log(strSql);
    const connection = mysql.createConnection(config)
    connection.query(strSql,[req.params.id],( err, results, fields) =>{
        if (err){
            console.log(err)
            res.sendStatus(500)
            connection.destroy();
            return false
            // throw err
            // res.end();
            // return
        }
        else{
            console.log("pontuação de Competição excluída com sucesso com o id:", results.insertedId)
            res.end()
            connection.destroy();
            return true;
        }
    })
}

exports.IncluirPtsCompeticaoJogador = (req, res) => {
    strSql : String;
    blnAtivo : Boolean;
    const connection = mysql.createConnection(config);
    if (req.body.PJ_PJATIVO == ''){
        blnAtivo = false
    }else {
        blnAtivo = true
    }
    strSql = "INSERT INTO PTSCOMPETICOESJOGADORES (PJ_CPID,PJ_JOID,PJ_JOMATRICULA,PJ_PJCOLOCACAO,PJ_PJPONTOSGANHOS,";
    strSql = strSql + " PJ_PJJOGOS,PJ_PJVITORIAS,PJ_PJEMPATE,PJ_PJDERROTA,PJ_PJGOLSPRO,PJ_PJGOLCONTRA,PJ_PJSALDOGOLS, ";
    strSql = strSql + " PJ_PJPONTOS,PJ_PJOBSERVACAO,PJ_PJATIVO,PJ_JGID, PJ_PJDATACADASTRO) ";
    strSql = strSql + " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,Now())" ;
    console.log(strSql);
    connection.query(strSql,[req.body.PJ_CPID,req.body.PJ_JOID,req.body.PJ_JOMATRICULA,req.body.PJ_PJCOLOCACAO,req.body.PJ_PJPONTOSGANHOS,
        req.body.PJ_PJJOGOS,req.body.PJ_PJVITORIAS,req.body.PJ_PJEMPATE,req.body.PJ_PJDERROTA,req.body.PJ_PJGOLSPRO,req.body.PJ_PJGOLCONTRA,req.body.PJ_PJSALDOGOLS,
        req.body.PJ_PJPONTOS,req.body.PJ_PJOBSERVACAO,blnAtivo,req.body.PJ_JGID ],( err, results, fields) =>{
        if (err){
            console.log(err)
            res.sendStatus(500)
            connection.destroy();
            return
            // throw err
            // res.end();
            // return
        }
        console.log("Pontuação de Competicao inserida com sucesso com o id:", results.insertedId)
        res.end()
        connection.destroy();
    })
    return true;
}

exports.AlterarPtsCompeticaoJogador = (req, res) => {
    strSql : String;
    blnAtivo : Boolean;
    if (req.body.PJ_PJATIVO == ''){
        blnAtivo = false
    }else
    {
        blnAtivo = true
    }
    strSql = "UPDATE PTSCOMPETICOESJOGADORES SET PJ_CPID = ? ,PJ_JOID = ? , PJ_JOMATRICULA = ? ,PJ_PJCOLOCACAO = ? ,PJ_PJPONTOSGANHOS = ? ";
    strSql = strSql + ",PJ_PJJOGOS = ? ,PJ_PJVITORIAS = ? ,PJ_PJEMPATE = ? ,PJ_PJDERROTA = ? ,PJ_PJGOLSPRO = ? ,PJ_PJGOLCONTRA = ? ,PJ_PJSALDOGOLS = ? ";
    strSql = strSql + ",PJ_PJPONTOS = ? ,PJ_PJOBSERVACAO = ? ,PJ_PJATIVO = ?, PJ_JGID = ? ";
    strSql = strSql + " WHERE PJ_PJID = ? ";

    console.log(strSql);
    const connection = mysql.createConnection(config)
    connection.query(strSql,[req.body.PJ_CPID,req.body.PJ_JOID,req.body.PJ_JOMATRICULA,req.body.PJ_PJCOLOCACAO,req.body.PJ_PJPONTOSGANHOS
                            ,req.body.PJ_PJJOGOS,req.body.PJ_PJVITORIAS,req.body.PJ_PJEMPATE,req.body.PJ_PJDERROTA,req.body.PJ_PJGOLSPRO,req.body.PJ_PJGOLCONTRA,req.body.PJ_PJSALDOGOLS
                            ,req.body.PJ_PJPONTOS,req.body.PJ_PJOBSERVACAO,blnAtivo, req.body.PJ_JGID, req.body.PJ_PJID],( err, results, fields) =>{
        if (err){
            console.log(err)
            res.sendStatus(500)
            connection.destroy();
            res.end();
            return false;
        }

        console.log("Pontuação de competição alterada com sucesso com o id:", results.insertedId)
        res.end()
        connection.destroy();
        return true;
    })
}

exports.GetPtsCompeticaoJogadorId = (req, res) => {
    strSql : String;
    blnAtivo : Boolean;
    strSql = " SELECT    PJ.PJ_PJID,            PJ.PJ_CPID,            PJ.PJ_JGID,           PJ.PJ_JOMATRICULA, PJ_JOID, "
    strSql += "          PJ.PJ_PJCOLOCACAO,     PJ.PJ_PJPONTOSGANHOS,  PJ.PJ_PJJOGOS,        PJ.PJ_PJVITORIAS,  PJ_PJEMPATE, "
    strSql += "          PJ.PJ_PJDERROTA,       PJ.PJ_PJGOLSPRO,       PJ.PJ_PJGOLCONTRA,    PJ.PJ_PJSALDOGOLS, PJ_PJPONTOS, "
    strSql += "          PJ.PJ_PJOBSERVACAO,    PJ.PJ_PJATIVO,         PJ.PJ_PJDATACADASTRO, CP.CP_CPDATAINICIO "
    strSql += " FROM     PTSCOMPETICOESJOGADORES PJ "
    strSql += " JOIN     COMPETICOES CP ON CP.CP_CPID = PJ.PJ_CPID "
    strSql += " WHERE    PJ_PJID = ? ";
    console.log(strSql);
    const connection = mysql.createConnection(config)
    connection.query(strSql,[req.params.id],( err, rows, fields) =>{
        connection.destroy();
        if (err) {return res.status(500).send({ error: err}) }
        if (rows.length < 1){ return res.status(401).send({ mensagem: 'Nenhum clube encontrado'})}
        const response = {
            PJ_PJID : rows[0].PJ_PJID,
            PJ_CPID : rows[0].PJ_CPID,
            ano: rows[0].CP_CPDATAINICIO.getFullYear(),
            PJ_JOID : rows[0].PJ_JOID,
            PJ_JGID : rows[0].PJ_JGID,
            PJ_JOMATRICULA : rows[0].PJ_JPJ_JOMATRICULAOID,
            PJ_PJCOLOCACAO : rows[0].PJ_PJCOLOCACAO,
            PJ_PJPONTOSGANHOS : rows[0].PJ_PJPONTOSGANHOS,
            PJ_PJJOGOS : rows[0].PJ_PJJOGOS,
            PJ_PJVITORIAS : rows[0].PJ_PJVITORIAS,
            PJ_PJEMPATE : rows[0].PJ_PJEMPATE,
            PJ_PJDERROTA : rows[0].PJ_PJDERROTA,
            PJ_PJGOLSPRO : rows[0].PJ_PJGOLSPRO,
            PJ_PJGOLCONTRA : rows[0].PJ_PJGOLCONTRA,
            PJ_PJSALDOGOLS : rows[0].PJ_PJSALDOGOLS,
            PJ_PJPONTOS : rows[0].PJ_PJPONTOS,
            PJ_PJOBSERVACAO : rows[0].PJ_PJOBSERVACAO,
            PJ_PJATIVO : rows[0].PJ_PJATIVO,
            PJ_PJDATACADASTRO : rows[0].PJ_PJDATACADASTRO,
        }
        return res.status(200).send(response);

    })
}

exports.ImportarPontosCompeticao = (req, res) => {
    strSql : String;
    strIdJogadores : String;
    i : Number;

    i = 0;

    for (i = 0; i <= req.body.length - 1; i++){
        if (req.body[i] != null){
            // if (req.body[i].PJ_CPID == 0 || req.body[i].PJ_CPID == null){break};
            // console.log("CP " + req.body[i].PJ_CPID + " JOID=" + req.body[i].PJ_JOID + " iterator " + i)
            strSql = "DELETE FROM PTSCOMPETICOESJOGADORES WHERE PJ_CPID = ? AND PJ_JOID = ? ";
            console.log(strSql);
            const connection = mysql.createConnection(config);
            connection.query(strSql,[req.body[i].PJ_CPID,req.body[i].PJ_JOID],( err, rows, fields) =>{
                if (err) {return res.status(500).send({ error: err}) }
            })
        }
    }
 
    setTimeout(function() {
        for (i = 0; i <= req.body.length - 1; i++){
            if (req.body[i] != null && req.body[i].PJ_CPID != 0){
                strSql = "INSERT INTO PTSCOMPETICOESJOGADORES (PJ_CPID,PJ_JOMATRICULA,PJ_JOID,PJ_PJCOLOCACAO,";
                strSql += "PJ_PJPONTOSGANHOS,PJ_PJJOGOS,PJ_PJVITORIAS,PJ_PJEMPATE,PJ_PJDERROTA,PJ_PJGOLSPRO,";
                strSql += "PJ_PJGOLCONTRA,PJ_PJSALDOGOLS,PJ_PJPONTOS,PJ_JGID, PJ_PJOBSERVACAO,PJ_PJATIVO,PJ_PJDATACADASTRO)";
                strSql += " VALUES ( ?,?,?,?,?,?,?,?,?,?,?,?,?,?, null,1,Now())";
                console.log(strSql);
                console.log("CP " + req.body[i].PJ_CPID + " JOID=" + req.body[i].PJ_JOID + " iterator " + i)
                const connection = mysql.createConnection(config);
                connection.query(strSql,[req.body[i].PJ_CPID,req.body[i].PJ_JOMATRICULA,req.body[i].PJ_JOID,req.body[i].PJ_PJCOLOCACAO,
                                            req.body[i].PJ_PJPONTOSGANHOS,req.body[i].PJ_PJJOGOS,req.body[i].PJ_PJVITORIAS,
                                            req.body[i].PJ_PJEMPATE,req.body[i].PJ_PJDERROTA,req.body[i].PJ_PJGOLSPRO,
                                            req.body[i].PJ_PJGOLCONTRA,req.body[i].PJ_PJSALDOGOLS,req.body[i].PJ_PJPONTOS,req.body[i].PJ_JGID],
                                        ( err, results, fields) =>{
                    connection.destroy();
                    if (err) {console.log(err + "chegou aqui");return res.status(500).send({ error: err}) }
                    res.end();
                })
            }
        }
    }, 4000);

    

    

}