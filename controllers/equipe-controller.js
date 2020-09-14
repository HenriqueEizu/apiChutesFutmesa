const mysql = require('mysql');
const config = require('../config');

exports.GetAllEquipes = (req,res) => {
    console.log(req.usuario);
    const connection = mysql.createConnection(config)
    strSql : String;

    strSql = " SELECT	EQ.EQ_EQID, EQ.EQ_EQNOME, EQ.EQ_USID, EQ.EQ_EQESCUDO, ";
    strSql += " EQ.EQ_EQOBSERVACAO, EQ.EQ_EQATIVO, EQ.EQ_EQDATACADASTRO, ";
    strSql += " US.US_USID, US.US_USNOMETRATAMENTO "
    strSql = strSql + " FROM	EQUIPES EQ "
    strSql = strSql + " JOIN	USUARIO US ON US.US_USID = EQ.EQ_USID; "
    connection.query(strSql,( err, rows, fields) =>{
        connection.destroy();
        if (err) {return res.status(500).send({ error: err}) }
        if (rows.length < 1){ return res.status(401).send({ mensagem: 'Nenhuma Equipe encontrado'})}
        const response = {
            competicoes: rows.map(cp => {
                return {
                    EQ_EQID  : cp.EQ_EQID,
                    EQ_EQNOME : cp.EQ_EQNOME,
                    EQ_USID : cp.EQ_USID,
                    OBJ_USUARIO : {
                        US_USID : cp.US_USID,
                        US_USNOMETRATAMENTO : cp.US_USNOMETRATAMENTO,
                    },
                    EQ_EQESCUDO : cp.EQ_EQESCUDO,
                    EQ_EQOBSERVACAO : cp.EQ_EQOBSERVACAO,
                    EQ_EQATIVO : cp.EQ_EQATIVO,
                    EQ_EQDATACADASTRO : cp.EQ_EQDATACADASTRO,
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
    strSql = "SELECT     A.JO_JOID, A.JO_JOAPELIDO, A.JO_JOFOTO, A.RJ_RJDATA, A.PR_PRPRECO,A.RJ_RJPOSICAO AS RJ_RJPOSICAOATUAL, B.RJ_RJPOSICAO, A.CL_CLID, A.CL_CLEMBLEMA,A.CL_CLSIGLA, A.JO_JOATIVO,A.EJ_EJID, A.EQ_EQID, A.EQ_EQNOME, A.EQ_EQESCUDO, "
    strSql = strSql + "  CASE 	WHEN  A.RJ_RJPOSICAO > B.RJ_RJPOSICAO THEN 'DESCE' "
    strSql = strSql + "         WHEN  A.RJ_RJPOSICAO < B.RJ_RJPOSICAO THEN 'SOBE' "
    strSql = strSql + "         ELSE 'IGUAL'"
    strSql = strSql + "  END AS STATUSPOSICAO, "
    strSql = strSql + "  ABS(A.RJ_RJPOSICAO - B.RJ_RJPOSICAO) AS POSICOES "
    strSql = strSql + "  FROM		( "
    strSql = strSql + "             SELECT		JO.JO_JOID, JO.JO_JOAPELIDO, JO.JO_JOFOTO, RJ.RJ_RJDATA, PR.PR_PRPRECO,RJ.RJ_RJPOSICAO, CL.CL_CLID, CL.CL_CLEMBLEMA,CL.CL_CLSIGLA, JO.JO_JOATIVO, EQJ.EJ_EJID,EQJ.EQ_EQID, EQJ.EQ_EQNOME, EQJ.EQ_EQESCUDO, "
    strSql = strSql + "                          row_number() OVER (partition by JO.JO_JOID, JO.JO_JOAPELIDO, JO.JO_JOFOTO ORDER BY RJ.RJ_RJDATA DESC) AS CTR "
    strSql = strSql + "             FROM		JOGADOR JO "
    strSql = strSql + "             JOIN		RANKINGJOGADORES RJ ON JO.JO_JOID = RJ.RJ_JOID  " 
    strSql = strSql + "             JOIN		PRECORANKING PR ON PR.PR_PRPOSRANKING = RJ.RJ_RJPOSICAO "
    strSql = strSql + "             JOIN		CLUBES CL ON CL.CL_CLID = JO.JO_CLID "
    strSql = strSql + "             LEFT JOIN	(SELECT EJ.EJ_EJID,EQ.EQ_EQID, EQ.EQ_EQNOME, EQ.EQ_EQESCUDO,EJ.EJ_JOID "
    strSql = strSql + "                         FROM EQUIPESJOGADOR EJ "
    strSql = strSql + "                         JOIN  EQUIPES EQ ON EQ.EQ_EQID = EJ.EJ_EQID AND EQ.EQ_USID = ? "
    strSql = strSql + "                         JOIN  USUARIO US ON US.US_USID = EQ.EQ_USID) EQJ ON EQJ.EJ_JOID = JO.JO_JOID "
    strSql = strSql + "             ) A "
    strSql = strSql + " LEFT JOIN	(SELECT	* "
    strSql = strSql + "             FROM	RANKINGJOGADORES RJ1 "
    strSql = strSql + "             JOIN	JOGADOR JO1 ON RJ1.RJ_JOID = JO1.JO_JOID ) B ON  B.JO_JOID = A.JO_JOID AND B.RJ_RJDATA = DATE_ADD(A.RJ_RJDATA, INTERVAL -1 MONTH) "
    strSql = strSql + " WHERE 		A.CTR = 1 "
    connection.query(strSql,[req.params.id,req.params.id],( err, rows, fields) =>{
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
                    JO_JOATIVO : rj.JO_JOATIVO,
                    EJ_EJID : rj.EJ_EJID,
                    EQ_EQID : rj.EQ_EQID,
                    EQ_EQNOME : rj.EQ_EQNOME,
                    EQ_EQESCUDO : rj.EQ_EQESCUDO,
                }
            })
        }
        return res.status(200).send(response.rankingJogStatus);
    }
)}

exports.RankingEquipes = (req,res) => {
    console.log(req.usuario);
    const connection = mysql.createConnection(config)
    strSql : String;

    strSql = "  SELECT  B.COLOCACAO, B.AJ_EQNOME,B.AJ_USNOMETRATAMENTO, B.TOTAL, B.AJ_EQESCUDO, B.AJ_USID ";
    strSql += " FROM ( ";
	strSql += " 		SELECT RANK() OVER (PARTITION BY A.AJ_CPDESCRICAO ORDER BY A.TOTAL DESC) AS COLOCACAO,  ";
	strSql += " 		A.AJ_EQNOME,A.AJ_USNOMETRATAMENTO, A.TOTAL, A.AJ_EQESCUDO, A.AJ_USID ";
	strSql += " 		FROM	(	SELECT  NULL AS AJ_CPDESCRICAO,SUM(AJ.AJ_AJPONTOS) as TOTAL, AJ.AJ_EQNOME, AJ.AJ_USNOMETRATAMENTO, AJ.AJ_EQESCUDO, AJ.AJ_USID ";
	strSql += " 					FROM	futmesacartola.APURACAOJOGADORES AJ  ";
	strSql += " 					GROUP BY AJ.AJ_EQNOME, AJ.AJ_USNOMETRATAMENTO,AJ.AJ_EQESCUDO,AJ.AJ_USID) A  ";
	strSql += " 	 ) B ";
	// strSql += " WHERE B.AJ_USID = ? ";

    console.log(strSql);
    connection.query(strSql,( err, rows, fields) =>{
        connection.destroy();
        if (err) {console.log(err); return res.status(500).send({ error: err}) }
        if (rows.length < 1){ 
            console.log("nulo")
            const responseNull = {
                rankingEquipes: {
                    COLOCACAO : null,
                    TOTAL : null,
                    AJ_EQNOME : null,
                    AJ_USNOMETRATAMENTO : null,
                    AJ_EQESCUDO : null,
                    AJ_USID : null,
                }
            }
            return res.status(200).send(responseNull)
        }
        const response = {
            rankingEquipes: rows.map(re => {
                return {
                    COLOCACAO : re.COLOCACAO,
                    TOTAL : re.TOTAL,
                    AJ_EQNOME : re.AJ_EQNOME,
                    AJ_USNOMETRATAMENTO : re.AJ_USNOMETRATAMENTO,
                    AJ_EQESCUDO : re.AJ_EQESCUDO,
                    AJ_USID : re.AJ_USID,
                }
            })
        }
        console.log(response.rankingEquipes);
        return res.status(200).send(response.rankingEquipes);
    }
)}

exports.PontuacaoUltimaRodada = (req,res) => {
    const connection = mysql.createConnection(config)
    strSql : String;

    strSql = "  SELECT  B.COLOCACAO, B.AJ_EQNOME,B.AJ_USNOMETRATAMENTO, B.TOTAL, B.AJ_EQESCUDO, B.AJ_USID ";
    strSql += " FROM ( ";
	strSql += " 		SELECT RANK() OVER (PARTITION BY A.AJ_CPDESCRICAO ORDER BY A.TOTAL DESC) AS COLOCACAO,  ";
	strSql += " 		A.AJ_EQNOME,A.AJ_USNOMETRATAMENTO, A.TOTAL, A.AJ_EQESCUDO, A.AJ_USID ";
	strSql += " 		FROM	(	SELECT  NULL AS AJ_CPDESCRICAO,SUM(AJ.AJ_AJPONTOS) as TOTAL, AJ.AJ_EQNOME, AJ.AJ_USNOMETRATAMENTO, AJ.AJ_EQESCUDO, AJ.AJ_USID ";
    strSql += " 					FROM	futmesacartola.APURACAOJOGADORES AJ  ";
    strSql += "                     WHERE   AJ.AJ_AJDATAVIGENTE IN (SELECT MAX(AJ_AJDATAVIGENTE) FROM futmesacartola.APURACAOJOGADORES) ";
	strSql += " 					GROUP BY AJ.AJ_EQNOME, AJ.AJ_USNOMETRATAMENTO,AJ.AJ_EQESCUDO,AJ.AJ_USID) A  ";
	strSql += " 	 ) B ";
	// strSql += " WHERE B.AJ_USID = ? ";

    console.log(strSql);
    connection.query(strSql,( err, rows, fields) =>{
        connection.destroy();
        if (err) {console.log(err); return res.status(400).send({ error: err}) }
        if (rows.length < 1){ 
            console.log("nulo")
            const responseNull = {
                rankingEquipes: {
                    COLOCACAO : null,
                    TOTAL : null,
                    AJ_EQNOME : null,
                    AJ_USNOMETRATAMENTO : null,
                    AJ_EQESCUDO : null,
                    AJ_USID : null,
                }
            }
            return res.status(200).send(responseNull)
        }
        const response = {
            rankingEquipes: rows.map(re => {
                return {
                    COLOCACAO : re.COLOCACAO,
                    TOTAL : re.TOTAL,
                    AJ_EQNOME : re.AJ_EQNOME,
                    AJ_USNOMETRATAMENTO : re.AJ_USNOMETRATAMENTO,
                    AJ_EQESCUDO : re.AJ_EQESCUDO,
                    AJ_USID : re.AJ_USID,
                }
            })
        }
        console.log(response.rankingEquipes);
        return res.status(200).send(response.rankingEquipes);
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

exports.DiasFechaMercado = (req,res) => {
    strSql : String;
    blnAtivo : Boolean;
    strSql = " SELECT	DATEDIFF( CP.CP_CPDATALIMITEAPOSTA,NOW()) as DiasFechaMercado ";
    strSql += " FROM	futmesacartola.COMPETICOES   CP ";
    strSql += " WHERE	DATEDIFF( CP.CP_CPDATALIMITEAPOSTA,NOW()) > 0 ";
    strSql += " ORDER BY DATEDIFF( CP.CP_CPDATALIMITEAPOSTA,NOW()) ASC ";

    const connection = mysql.createConnection(config)
    connection.query(strSql,( err, rows, fields) =>{
        connection.destroy();
        if (err) {return res.status(500).send({ error: err}) }
        if (rows.length < 1){ 
            const responseNull = {
                DiasFechaMercado  : null,
            }
            return res.status(200).send(responseNull);}
        const response = {
            DiasFechaMercado  : rows[0].DiasFechaMercado,
        }
        return res.status(200).send(response);
    })




    // console.log(req.usuario);
    // const connection = mysql.createConnection(config)
    // strSql : String;
    // strSql = " SELECT	DATEDIFF( CP.CP_CPDATALIMITEAPOSTA,NOW()) as DiasFechaMercado ";
    // strSql += " FROM	futmesacartola.COMPETICOES   CP ";
    // strSql += " where	DATEDIFF( CP.CP_CPDATALIMITEAPOSTA,NOW()) > 0 ";
    // strSql += " order	by DATEDIFF( CP.CP_CPDATALIMITEAPOSTA,NOW()) ";
    // connection.query(strSql,( err, rows, fields) =>{
    //     connection.destroy();
    //     if (err) {return res.status(500).send({ error: err}) }
    //     if (rows.length < 1){ return res.status(401).send({ mensagem: 'Nenhuma Imagem encontrado'})}
    //     const response1 = {
    //         EQ_EQID  : rows[0].DiasFechaMercado,
    //     }
    //     return res.status(200).send(response);
    // })
    // console.log(strSql);
    // // console.log(response);
    // return res.status(200).send(response1);
}

exports.Mercadofechado = (req,res) => {
    strSql : String;
    blnAtivo : Boolean;
    strSql = " SELECT	count(*) as Mercadofechado ";
    strSql += " FROM	futmesacartola.COMPETICOES   CP ";
    strSql += " where	NOW() between CP.CP_CPDATALIMITEAPOSTA and  CP.CP_CPDATAINICIO ";
    const connection = mysql.createConnection(config)
    connection.query(strSql,( err, rows, fields) =>{
        connection.destroy();
        if (err) {return res.status(500).send({ error: err}) }
        const response = {
            Mercadofechado  : rows[0].Mercadofechado,
        }
        return res.status(200).send(response);
    })
}



exports.ExcluirEquipe = (req, res) => {
    strSql : String;
    blnAtivo : Boolean;
    strSql = "DELETE FROM EQUIPES WHERE EQ_EQID = ? ";
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

exports.AlterarEquipe = (req, res) => {
    strSql : String;
    blnAtivo : Boolean;
    const connection = mysql.createConnection(config);
    if (req.body.EQ_EQATIVO == ''){
        blnAtivo = false
    }else
    {
        blnAtivo = true
    }
    // strSql = "UPDATE EQUIPES SET EQ_EQNOME = ?, EQ_USID = ?, EQ_EQESCUDO = ?, EQ_EQATIVO = ? , EQ_EQOBSERVACAO = ?  "
    strSql = "UPDATE EQUIPES SET EQ_EQNOME = ?, EQ_EQESCUDO = ?, EQ_EQATIVO = ? , EQ_EQOBSERVACAO = ?  "
    strSql = strSql + " WHERE EQ_EQID = ? " ;
    console.log(strSql);
    connection.query(strSql,[req.body.EQ_EQNOME,req.body.EQ_EQESCUDO,blnAtivo,req.body.EQ_EQOBSERVACAO, req.body.EQ_EQID],( err, results, fields) =>{
        if (err) {return res.status(500).send({ error: err}) };
        connection.destroy();
        res.end()
        return true;
    })
}

exports.IncluirEquipe = (req, res) => {
    strSql : String;
    blnAtivo : Boolean;
    const connection = mysql.createConnection(config);
    if (req.body.EQ_EQATIVO == ''){
        blnAtivo = false
    }else
    {
        blnAtivo = true
    }
    strSql = "INSERT INTO EQUIPES (EQ_EQNOME,EQ_USID,EQ_EQESCUDO,EQ_EQATIVO,EQ_EQOBSERVACAO,EQ_EQDATACADASTRO) "
    strSql = strSql + " VALUES (?,?,?,?,?,Now()) ;" ;
    console.log(strSql);
    connection.query(strSql,[req.body.EQ_EQNOME,req.body.EQ_USID,req.body.EQ_EQESCUDO,blnAtivo,req.body.EQ_EQOBSERVACAO],( err, results, fields) =>{
        if (err) {return res.status(500).send({ error: err}) };
        connection.destroy();
        res.end()
        return true;
    })
}

exports.GetEquipeId = (req, res) => {
    strSql : String;
    blnAtivo : Boolean;
    strSql = "SELECT * FROM EQUIPES WHERE EQ_EQID = ? ";
    console.log(strSql);
    const connection = mysql.createConnection(config)
    connection.query(strSql,[req.params.id],( err, rows, fields) =>{
        connection.destroy();
        if (err) {return res.status(500).send({ error: err}) }
        if (rows.length < 1){ 
            const responseNull = {
                EQ_EQID  : null,
                EQ_EQNOME : null,
                EQ_USID : null,
                // OBJ_USUARIO : rows[0].OBJ_USUARIO,
                EQ_EQESCUDO : null,
                EQ_EQOBSERVACAO : null,
                EQ_EQATIVO : null,
                EQ_EQDATACADASTRO : null,
            }
            return res.status(200).send(responseNull);}
        const response = {
            EQ_EQID  : rows[0].EQ_EQID,
            EQ_EQNOME : rows[0].EQ_EQNOME,
            EQ_USID : rows[0].EQ_USID,
            // OBJ_USUARIO : rows[0].OBJ_USUARIO,
            EQ_EQESCUDO : rows[0].EQ_EQESCUDO,
            EQ_EQOBSERVACAO : rows[0].EQ_EQOBSERVACAO,
            EQ_EQATIVO : rows[0].EQ_EQATIVO,
            EQ_EQDATACADASTRO : rows[0].EQ_EQDATACADASTRO,
        }
        return res.status(200).send(response);

    })
}

exports.GetEquipeIdPorusuario = (req, res) => {
    strSql : String;
    blnAtivo : Boolean;
    strSql = "SELECT * FROM EQUIPES WHERE EQ_USID = ? ";
    console.log(strSql);
    const connection = mysql.createConnection(config)
    connection.query(strSql,[req.params.id],( err, rows, fields) =>{
        connection.destroy();
        if (err) {return res.status(500).send({ error: err}) }
        if (rows.length < 1){ 
            const responseNull = {
                EQ_EQID  : null,
                EQ_EQNOME : null,
                EQ_USID : null,
                // OBJ_USUARIO : rows[0].OBJ_USUARIO,
                EQ_EQESCUDO : null,
                EQ_EQOBSERVACAO : null,
                EQ_EQATIVO : null,
                EQ_EQDATACADASTRO : null,
            }
            return res.status(200).send(responseNull);}
        const response = {
            EQ_EQID  : rows[0].EQ_EQID,
            EQ_EQNOME : rows[0].EQ_EQNOME,
            EQ_USID : rows[0].EQ_USID,
            // OBJ_USUARIO : rows[0].OBJ_USUARIO,
            EQ_EQESCUDO : rows[0].EQ_EQESCUDO,
            EQ_EQOBSERVACAO : rows[0].EQ_EQOBSERVACAO,
            EQ_EQATIVO : rows[0].EQ_EQATIVO,
            EQ_EQDATACADASTRO : rows[0].EQ_EQDATACADASTRO,
        }
        return res.status(200).send(response);

    })
}

exports.VerificaEquipe = (req,res) => {
    strSql : String;
    const connection = mysql.createConnection(config)
    strSql = "SELECT EQ_EQNOME FROM EQUIPES "
    connection.query(strSql,( err, rows, fields) =>{
        connection.destroy();
        if (err) {return res.status(500).send({ error: err}) }
        if (rows.length < 1){ 
            const responseNull = {
                clubes: { nomeEquipe: null,
                        }
                            }
            return res.status(200).send(responseNull);
        }
        const response = {
            clubes: rows.map( eq => { 
                return { nomeEquipe: eq.EQ_EQNOME,
                        }
            })
        }
        return res.status(200).send(response);
    })

}
