const mysql = require('mysql');
const config = require('../config');

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
    strSql = "INSERT INTO PTSCOMPETICOESJOGADORES (PJ_CPID,PJ_JOID,PJ_PJPONTOS,PJ_PJOBSERVACAO, ";
    strSql = strSql + " PJ_PJATIVO,PJ_PJDATACADASTRO) ";
    strSql = strSql + " VALUES (?,?,?,?,?,Now())" ;
    console.log(strSql);
    connection.query(strSql,[req.body.PJ_CPID,req.body.PJ_JOID,req.body.PJ_PJPONTOS,req.body.PJ_PJOBSERVACAO
                            ,blnAtivo ],( err, results, fields) =>{
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
    strSql = "UPDATE PTSCOMPETICOESJOGADORES SET PJ_CPID = ? ,PJ_JOID = ? , PJ_PJPONTOS = ? "
    strSql = strSql + ",PJ_PJOBSERVACAO = ? ,PJ_PJATIVO = ? ";
    strSql = strSql + " WHERE PJ_PJID = ? ";

    console.log(strSql);
    const connection = mysql.createConnection(config)
    connection.query(strSql,[req.body.PJ_CPID,req.body.PJ_JOID,req.body.PJ_PJPONTOS
                            ,req.body.PJ_PJOBSERVACAO,blnAtivo, req.body.PJ_PJID],( err, results, fields) =>{
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
    strSql = "SELECT * FROM PTSCOMPETICOESJOGADORES WHERE PJ_PJID = ? ";
    console.log(strSql);
    const connection = mysql.createConnection(config)
    connection.query(strSql,[req.params.id],( err, rows, fields) =>{
        connection.destroy();
        if (err) {return res.status(500).send({ error: err}) }
        if (rows.length < 1){ return res.status(401).send({ mensagem: 'Nenhum clube encontrado'})}
        const response = {
            PJ_PJID : rows[0].PJ_PJID,
            PJ_CPID : rows[0].PJ_CPID,
            PJ_JOID : rows[0].PJ_JOID,
            PJ_PJPONTOS : rows[0].PJ_PJPONTOS,
            PJ_PJOBSERVACAO : rows[0].PJ_PJOBSERVACAO,
            PJ_PJATIVO : rows[0].PJ_PJATIVO,
            PJ_PJDATACADASTRO : rows[0].PJ_PJDATACADASTRO,
        }
        return res.status(200).send(response);

    })
}