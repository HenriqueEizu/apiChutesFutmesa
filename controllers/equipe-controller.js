const mysql = require('mysql');
const config = require('../config');

exports.GetAllEquipes = (req,res) => {
    console.log(req.usuario);
    const connection = mysql.createConnection(config)
    strSql : String;
    strSql = "SELECT	EQ.*, US.US_USID, US.US_USNOMETRATAMENTO "
    strSql = strSql + " FROM	EQUIPES EQ "
    strSql = strSql + " JOIN	USUARIO US ON US.US_USID = EQ.EQ_USID; "
    connection.query(strSql,( err, rows, fields) =>{
        connection.destroy();
        if (err) {return res.status(500).send({ error: err}) }
        if (rows.length < 1){ return res.status(401).send({ mensagem: 'Nenhuma Equipe encontrado'})}
        const response = {
            competicoes: rows.map(cp => {
                return {
                    CP_CPID : cp.CP_CPID,
                    CP_CPDESCRICAO : cp.CP_CPDESCRICAO,
                    CP_CPCIDADE : cp.CP_CPCIDADE,
                    CP_ROID : cp.CP_ROID,
                    OBJ_Rodada :  {
                        RO_ROID : cp.RO_ROID,
                        RO_RODESCRICAO  : cp.RO_RODESCRICAO,
                    },
                    CP_CPDATALIMITEAPOSTA : cp.CP_CPDATALIMITEAPOSTA,
                    CP_CPDATAINICIO : cp.CP_CPDATAINICIO,
                    CP_CJID : cp.CP_CJID,
                    OBJ_CATEGORIAJOGADOR  : {
                        CJ_CJID : cp.CJ_CJID,
                        CJ_CJDESCRICAO  : cp.CJ_CJDESCRICAO,
                    },
                    CP_CPATIVO : cp.CP_CPATIVO,
                    CP_CPDATACADASTRO : cp.CP_CPDATACADASTRO,
                    CP_CPFOTO : cp.CP_CPFOTO
                }
            })
        }
        return res.status(200).send(response.competicoes);
    }
)}

exports.RankingJogadorStatus = (req,res) => {
    console.log(req.usuario);
    const connection = mysql.createConnection(config)
    strSql : String;
    strSql = "SELECT     A.JO_JOID, A.JO_JOAPELIDO, A.JO_JOFOTO, A.RJ_RJDATA, A.PR_PRPRECO,A.RJ_RJPOSICAO AS RJ_RJPOSICAOATUAL, B.RJ_RJPOSICAO, A.CL_CLID, A.CL_CLEMBLEMA,A.CL_CLSIGLA, A.JO_JOATIVO, "
    strSql = strSql + "  CASE 	WHEN  A.RJ_RJPOSICAO > B.RJ_RJPOSICAO THEN 'DESCE' "
    strSql = strSql + "         WHEN  A.RJ_RJPOSICAO < B.RJ_RJPOSICAO THEN 'SOBE' "
    strSql = strSql + "         ELSE 'IGUAL'"
    strSql = strSql + "  END AS STATUSPOSICAO, "
    strSql = strSql + "  ABS(A.RJ_RJPOSICAO - B.RJ_RJPOSICAO) AS POSICOES "
    strSql = strSql + "  FROM		( "
    strSql = strSql + "             SELECT		JO.JO_JOID, JO.JO_JOAPELIDO, JO.JO_JOFOTO, RJ.RJ_RJDATA, PR.PR_PRPRECO,RJ.RJ_RJPOSICAO, CL.CL_CLID, CL.CL_CLEMBLEMA,CL.CL_CLSIGLA, JO.JO_JOATIVO, "
    strSql = strSql + "                          row_number() OVER (partition by JO.JO_JOID, JO.JO_JOAPELIDO, JO.JO_JOFOTO ORDER BY RJ.RJ_RJDATA DESC) AS CTR "
    strSql = strSql + "             FROM		JOGADOR JO "
    strSql = strSql + "             JOIN		RANKINGJOGADORES RJ ON JO.JO_JOID = RJ.RJ_JOID  " 
    strSql = strSql + "             JOIN		PRECORANKING PR ON PR.PR_PRPOSRANKING = RJ.RJ_RJPOSICAO "
    strSql = strSql + "             JOIN		CLUBES CL ON CL.CL_CLID = JO.JO_CLID "
    strSql = strSql + "             ) A "
    strSql = strSql + " JOIN		(SELECT	* "
    strSql = strSql + "             FROM	RANKINGJOGADORES RJ1 "
    strSql = strSql + "             JOIN	JOGADOR JO1 ON RJ1.RJ_JOID = JO1.JO_JOID ) B ON  B.JO_JOID = A.JO_JOID AND B.RJ_RJDATA = DATE_ADD(A.RJ_RJDATA, INTERVAL -1 MONTH) "
    strSql = strSql + " WHERE 		A.CTR = 1 "
    connection.query(strSql,( err, rows, fields) =>{
        connection.destroy();
        if (err) {return res.status(500).send({ error: err}) }
        if (rows.length < 1){ return res.status(401).send({ mensagem: 'Nenhum status de jogador encontrado'})}
        const response = {
            rankingJogStatus: rows.map(rj => {
                return {
                    JO_JOID : rj.JO_JOID,
                    JO_JOAPELIDO : rj.JO_JOAPELIDO,
                    JO_JOFOTO : rj.JO_JOFOTO,
                    RJ_RJDATA : rj.RJ_RJDATA,
                    PR_PRPRECO : rj.PR_PRPRECO,
                    RJ_RJPOSICAOATUAL : rj.RJ_RJPOSICAOATUAL,
                    RJ_RJPOSICAO : rj.RJ_RJPOSICAO,
                    STATUSPOSICAO : rj.STATUSPOSICAO,
                    POSICOES : rj.POSICOES,
                    CL_CLID : rj.CL_CLID,
                    CL_CLEMBLEMA : rj.CL_CLEMBLEMA,
                    CL_CLSIGLA : rj.CL_CLSIGLA,
                    JO_JOATIVO : rj.JO_JOATIVO
                }
            })
        }
        return res.status(200).send(response.rankingJogStatus);
    }
)}

exports.ImagemEscudos = (req,res) => {
    console.log(req.usuario);
    const connection = mysql.createConnection(config)
    strSql : String;
    strSql = "SELECT	* "
    strSql = strSql + " FROM	IMAGENSESCUDO  "
    connection.query(strSql,( err, rows, fields) =>{
        connection.destroy();
        if (err) {return res.status(500).send({ error: err}) }
        if (rows.length < 1){ return res.status(401).send({ mensagem: 'Nenhuma Imagem encontrado'})}
        const response = {
            competicoes: rows.map(im => {
                return {
                    IM_IMIG : im.IM_IMIG,
                    IM_IMPATH : im.IM_IMPATH,
                    IM_IMOBSERVACAO : im.IM_IMOBSERVACAO,
                    IM_IMATIVO : im.IM_IMATIVO,
                    IM_IMDATACADASTRO :  im.IM_IMDATACADASTRO
                }
            })
        }
        return res.status(200).send(response.competicoes);
    }
)}


exports.ExcluirEquipe = (req, res) => {
    strSql : String;
    blnAtivo : Boolean;
    strSql = "DELETE FROM COMPETICOES WHERE CP_CPID = ? ";
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
            console.log("Competição excluída com sucesso com o id:", results.insertedId)
            res.end()
            connection.destroy();
            return true;
        }
    })
}

exports.IncluirEquipe = (req, res) => {
    strSql : String;
    blnAtivo : Boolean;
    const connection = mysql.createConnection(config);
    if (req.body.CP_CPATIVO == ''){
        blnAtivo = false
    }else {
        blnAtivo = true
    }
    strSql = "INSERT INTO COMPETICOES (CP_CPCIDADE,CP_CPDESCRICAO,CP_CPFOTO,CP_ROID,CP_CPDATALIMITEAPOSTA,CP_CPDATAINICIO,CP_CJID, ";
    strSql = strSql + " CP_CPATIVO,CP_CPDATACADASTRO) ";
    strSql = strSql + " VALUES (?,?,?,?,?,?,?,?,Now())" ;
    console.log(strSql);
    connection.query(strSql,[req.body.CP_CPCIDADE,req.body.CP_CPDESCRICAO,req.body.CP_CPFOTO,req.body.CP_ROID
                            ,req.body.CP_CPDATALIMITEAPOSTA,req.body.CP_CPDATAINICIO,req.body.CP_CJID,blnAtivo ],( err, results, fields) =>{
        if (err){
            console.log(err)
            res.sendStatus(500)
            connection.destroy();
            return
            // throw err
            // res.end();
            // return
        }

        console.log("Competicao inserida com sucesso com o id:", results.insertedId)
        res.end()
        connection.destroy();
    })
    return true;
}

exports.AlterarEquipe = (req, res) => {
    strSql : String;
    blnAtivo : Boolean;
    if (req.body.CP_CPATIVO == ''){
        blnAtivo = false
    }else
    {
        blnAtivo = true
    }
    strSql = "UPDATE COMPETICOES SET CP_CPDESCRICAO = ? ,CP_CPCIDADE = ? , CP_ROID = ? "
    strSql = strSql + ",CP_CPDATALIMITEAPOSTA = ? ,CP_CPDATAINICIO = ?, CP_CJID = ? , CP_CPATIVO = ? , CP_CPFOTO = ? ";
    strSql = strSql + " WHERE CP_CPID = ? ";

    console.log(strSql);
    const connection = mysql.createConnection(config)
    connection.query(strSql,[req.body.CP_CPDESCRICAO,req.body.CP_CPCIDADE,req.body.CP_ROID
                            ,req.body.CP_CPDATALIMITEAPOSTA,req.body.CP_CPDATAINICIO,req.body.CP_CJID,blnAtivo
                            ,req.body.CP_CPFOTO, req.body.CP_CPID],( err, results, fields) =>{
        if (err){
            console.log(err)
            res.sendStatus(500)
            connection.destroy();
            res.end();
            return false;
        }

        console.log("COMPETIÇÃO ALTERADO com sucesso com o id:", results.insertedId)
        res.end()
        connection.destroy();
        return true;
    })
}

exports.Upload = function (req, res) {
    var formidable = require('formidable');
    var fs = require('fs');
    var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            console.log("Parsing done.");
            console.dir(req.headers);
            console.log(fields);
            console.log(files.fileKey.path);
        var oldpath = files.fileKey.path;
        var newpath = 'C:/Users/h_eiz/Documents/chutesfutmesa/src/assets/images/fotosEquipes/' + files.fileKey.name;
        fileExists(newpath).then(exists => {
            console.log(exists + "jjjjjj")
            if (exists == false){
                fs.rename(oldpath, newpath, function (err) {
                    if (err) throw err;
                    res.write('File uploaded and moved!');
                    // res.end();
                    // return files.fileKey.name;
                });
            }
            res.end();
            return files.fileKey.name;
        })
        
    });
  };

exports.GetEquipeId = (req, res) => {
    strSql : String;
    blnAtivo : Boolean;
    strSql = "SELECT * FROM COMPETICOES WHERE CP_CPID = ? ";
    console.log(strSql);
    const connection = mysql.createConnection(config)
    connection.query(strSql,[req.params.id],( err, rows, fields) =>{
        connection.destroy();
        if (err) {return res.status(500).send({ error: err}) }
        if (rows.length < 1){ return res.status(401).send({ mensagem: 'Nenhum clube encontrado'})}
        const response = {
            CP_CPID : rows[0].CP_CPID,
            CP_CPDESCRICAO : rows[0].CP_CPDESCRICAO,
            CP_CPCIDADE : rows[0].CP_CPCIDADE,
            CP_ROID : rows[0].CP_ROID,
            CP_CPDATALIMITEAPOSTA : rows[0].CP_CPDATALIMITEAPOSTA,
            CP_CPDATAINICIO : rows[0].CP_CPDATAINICIO,
            CP_CJID : rows[0].CP_CJID,
            CP_CPATIVO : rows[0].CP_CPATIVO,
            CP_CPDATACADASTRO : rows[0].CP_CPDATACADASTRO,
            CP_CPFOTO : rows[0].CP_CPFOTO,
        }
        return res.status(200).send(response);

    })
}