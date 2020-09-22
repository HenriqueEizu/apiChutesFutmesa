const mysql = require('mysql');
const config = require('../config');

exports.ImportarRanking = (req, res) => {
    strSql : String;
    blnAtivo : Boolean;
    I : Number;
    const connection = mysql.createConnection(config);

    strSql = "DELETE FROM RANKINGJOGADORES WHERE RJ_RJMES = ?  AND RJ_RJANO = ? "
    console.log(strSql);
    connection.beginTransaction(function(err) {
        connection.query(strSql,[req.body[0].RJ_RJMES,req.body[0].RJ_RJANO],( err, results, fields) =>{
            if (err) {connection.rollback(); return res.status(500).send({ error: err}) };
            for(i = 0; i<= req.body.length -1 ; i++){
                if (req.body[i].RJ_JOMATRICULA == 0 || req.body[i].RJ_JOMATRICULA == null){connection.commit(); res.end(); return;}
                // console.log(req.body[i])
                strSql = "INSERT INTO RANKINGJOGADORES (RJ_RJMES,RJ_RJANO,RJ_RJDATA,RJ_JOMATRICULA,RJ_RJPOSICAO,RJ_RJPOSICAOANO,RJ_RJPONTOS,RJ_JOID,RJ_CJID,RJ_RJOBSERVACAO,RJ_RJATIVO,RJ_RJDATACADASTRO)";
                strSql = strSql + " VALUES (?,?,?,?,?,?,?,?,?, null, 1,Now()) ;" ;
                console.log(strSql);
                console.log(req.body[i].RJ_CJID);
                connection.query(strSql,[req.body[i].RJ_RJMES,req.body[i].RJ_RJANO,req.body[i].RJ_RJDATA,req.body[i].RJ_JOMATRICULA,req.body[i].RJ_RJPOSICAO,req.body[i].RJ_RJPOSICAOANO,req.body[i].RJ_RJPONTOS,req.body[i].RJ_JOID,req.body[i].RJ_CJID],( err, results, fields) =>{
                    if (err) {connection.rollback();console.log(err + "chegou aqui");return res.status(500).send({ error: err}) }
                    if ( i == req.body.length ){RTCRtpSender
                        console.log("chegou aqui 2")
                        connection.commit();
                        res.end()
                    }
                })
            }
        })
    })
}

exports.OsMaisEscalados = (req, res) => {
    strSql : String;
    blnAtivo : Boolean;
    strSql = " SELECT	COUNT(*) AS AJ_AJPONTOS, AJ_JOID, AJ_JOAPELIDO , AJ_CLID, AJ_CLSIGLA, AJ_CLEMBLEMA, AJ_JOFOTO "
    strSql += " FROM APURACAOJOGADORES "
    strSql += " GROUP BY AJ_JOID, AJ_JOAPELIDO , AJ_CLID, AJ_CLSIGLA, AJ_CLEMBLEMA "
    strSql += " ORDER BY COUNT(*) DESC "
    
    console.log(strSql);
    const connection = mysql.createConnection(config)
    connection.query(strSql,( err, rows, fields) =>{
        connection.destroy();
        if (err) {return res.status(500).send({ error: err}) }
        if (rows.length < 1){ 
            const response = {
                AJ_AJID : null,
                AJ_AJDATAVIGENTE : null,
                AJ_CPID : null,
                AJ_CPDESCRICAO : null,
                AJ_ROID : null,
                AJ_RODESCRICAO : null,
                AJ_JOID :  null,
                AJ_JOAPELIDO :  null,
                AJ_EQID : null,
                AJ_EQNOME : null,
                AJ_USID : null,
                AJ_USNOMETRATAMENTO : null,
                AJ_AJPONTOS :  null,
                AJ_EQESCUDO : null,
                AJ_CLID :  null,
                AJ_CLSIGLA :  null,
                AJ_CLEMBLEMA :  null,
                AJ_JOFOTO : null
            }
            return res.status(200).send(response);
        }
        const response = {
            maisEscalados: rows.map(me => {
                return {
                    AJ_AJID : null,
                    AJ_AJDATAVIGENTE : null,
                    AJ_CPID : null,
                    AJ_CPDESCRICAO : null,
                    AJ_ROID : null,
                    AJ_RODESCRICAO : null,
                    AJ_JOID :  me.AJ_JOID,
                    AJ_JOAPELIDO : me.AJ_JOAPELIDO,
                    AJ_EQID : null,
                    AJ_EQNOME : null,
                    AJ_USID : null,
                    AJ_USNOMETRATAMENTO : null,
                    AJ_AJPONTOS : me.AJ_AJPONTOS,
                    AJ_EQESCUDO : null,
                    AJ_CLID : me.AJ_CLID,
                    AJ_CLSIGLA : me.AJ_CLSIGLA,
                    AJ_CLEMBLEMA : me.AJ_CLEMBLEMA,
                    AJ_JOFOTO : me.AJ_JOFOTO
                }
            })
        }
        return res.status(200).send(response);
    })
}

exports.OsSeusEscalados = (req, res) => {
    strSql : String;
    blnAtivo : Boolean;
    strSql = " SELECT	SUM(AJ_AJPONTOS) AS AJ_AJPONTOS, AJ_JOID, AJ_JOAPELIDO , AJ_CLID, AJ_CLSIGLA, AJ_CLEMBLEMA, AJ_JOFOTO "
    strSql += " FROM APURACAOJOGADORES "
    strSql += " WHERE AJ_USID = ?"
    strSql += " GROUP BY AJ_JOID, AJ_JOAPELIDO , AJ_CLID, AJ_CLSIGLA, AJ_CLEMBLEMA "
    strSql += " ORDER BY SUM(AJ_AJPONTOS) DESC "
    
    console.log(strSql);
    const connection = mysql.createConnection(config)
    connection.query(strSql,[req.params.id],( err, rows, fields) =>{
        connection.destroy();
        if (err) {return res.status(500).send({ error: err}) }
        if (rows.length < 1){ 
            const response = {
                AJ_AJID : null,
                AJ_AJDATAVIGENTE : null,
                AJ_CPID : null,
                AJ_CPDESCRICAO : null,
                AJ_ROID : null,
                AJ_RODESCRICAO : null,
                AJ_JOID :  null,
                AJ_JOAPELIDO :  null,
                AJ_EQID : null,
                AJ_EQNOME : null,
                AJ_USID : null,
                AJ_USNOMETRATAMENTO : null,
                AJ_AJPONTOS :  null,
                AJ_EQESCUDO : null,
                AJ_CLID :  null,
                AJ_CLSIGLA :  null,
                AJ_CLEMBLEMA :  null,
                AJ_JOFOTO : null
            }
            return res.status(200).send(response);
        }
        const response = {
            maisEscalados: rows.map(me => {
                return {
                    AJ_AJID : null,
                    AJ_AJDATAVIGENTE : null,
                    AJ_CPID : null,
                    AJ_CPDESCRICAO : null,
                    AJ_ROID : null,
                    AJ_RODESCRICAO : null,
                    AJ_JOID :  me.AJ_JOID,
                    AJ_JOAPELIDO : me.AJ_JOAPELIDO,
                    AJ_EQID : null,
                    AJ_EQNOME : null,
                    AJ_USID : null,
                    AJ_USNOMETRATAMENTO : null,
                    AJ_AJPONTOS : me.AJ_AJPONTOS,
                    AJ_EQESCUDO : null,
                    AJ_CLID : me.AJ_CLID,
                    AJ_CLSIGLA : me.AJ_CLSIGLA,
                    AJ_CLEMBLEMA : me.AJ_CLEMBLEMA,
                    AJ_JOFOTO : me.AJ_JOFOTO
                }
            })
        }
        return res.status(200).send(response);
    })
}

exports.RankingGeral = (req, res) => {
    strSql : String;
    blnAtivo : Boolean;

    strSql = " SELECT 	RJ.RJ_RJID, RJ.RJ_RJDATA, RJ.RJ_JOMATRICULA, RJ.RJ_RJPOSICAO, RJ.RJ_RJPOSICAOANO, RJ.RJ_RJPONTOS, "
    strSql += "         JO.JO_JOID, JO.JO_JOAPELIDO, JO.JO_JOFOTO, JO.JO_JONOME, "
    strSql += "         CJ.CJ_CJID, CJ.CJ_CJDESCRICAO, "
    strSql += "         CL.CL_CLID, CL.CL_CLNOME, CL.CL_CLSIGLA, CL.CL_CLEMBLEMA "
    strSql += " FROM	futmesacartola.RANKINGJOGADORES RJ "
    strSql += " JOIN	futmesacartola.JOGADOR JO ON RJ.RJ_JOID = JO.JO_JOID "
    strSql += " JOIN	futmesacartola.categoriajogador CJ ON RJ.RJ_CJID = CJ.CJ_CJID "
    strSql += " JOIN	futmesacartola.clubes CL ON JO.JO_CLID = CL.CL_CLID "
    strSql += " WHERE	RJ.RJ_RJDATA IN (SELECT MAX(RJ_RJDATA) FROM futmesacartola.RANKINGJOGADORES) "
    strSql += " ORDER BY RJ.RJ_RJPOSICAO, CJ.CJ_CJID "

    console.log(strSql);
    const connection = mysql.createConnection(config)
    connection.query(strSql,[req.params.id],( err, rows, fields) =>{
        connection.destroy();
        if (err) {return res.status(500).send({ error: err}) }
        if (rows.length < 1){ 
            const response = {
                RJ_RJID : null,
                RJ_RJMES : null,
                RJ_RJANO : null,
                RJ_RJDATA : null,
                RJ_JOID : null,
                OBJ_JOGADOR : null,
                RJ_JOMATRICULA : null,
                RJ_RJPOSICAO : null,
                RJ_RJPOSICAOANO : null,
                RJ_RJPONTOS : null,
                RJ_CJID : null,
                OBJ_CATEGORIAJOGADOR : null,
                RJ_RJOBSERVACAO : null,
                RJ_RJATIVO : null,
                RJ_RJDATACADASTRO : null
            }
            return res.status(200).send(response);
        }
        const response = {
            rankingGeral: rows.map(me => {
                return {
                    RJ_RJID : me.RJ_RJID,
                    RJ_RJMES : null,
                    RJ_RJANO : null,
                    RJ_RJDATA : me.RJ_RJDATA,
                    RJ_JOID : me.JO_JOID,
                    OBJ_JOGADOR : {
                        JO_JOID : me.JO_JOID,
                        JO_JOAPELIDO : me.JO_JOAPELIDO,
                        JO_JOFOTO : me.JO_JOFOTO,
                        JO_JONOME : me.JO_JONOME,
                        OBJ_CLUBE : {
                            CL_CLID : me.CL_CLID,
                            CL_CLNOME : me.CL_CLNOME,
                            CL_CLNOME : me.CL_CLNOME,
                            CL_CLSIGLA : me.CL_CLSIGLA,
                            CL_CLEMBLEMA : me.CL_CLEMBLEMA,
                        }
                    },
                    RJ_JOMATRICULA : me.RJ_JOMATRICULA,
                    RJ_RJPOSICAO : me.RJ_RJPOSICAO,
                    RJ_RJPOSICAOANO : me.RJ_RJPOSICAOANO,
                    RJ_RJPONTOS : me.RJ_RJPONTOS,
                    RJ_CJID : me.CJ_CJID,
                    OBJ_CATEGORIAJOGADOR : {
                        CJ_CJID : me.CJ_CJID,
                        CJ_CJDESCRICAO : me.CJ_CJDESCRICAO,
                    },
                    RJ_RJOBSERVACAO : null,
                    RJ_RJATIVO : null,
                    RJ_RJDATACADASTRO : null
                }
            })
        }
        return res.status(200).send(response.rankingGeral);
    })
}

exports.CarregaParametros = (req, res) => {
    strSql : String;
    blnAtivo : Boolean;

    strSql = " SELECT 	PS.PS_PSID, PS.PS_PSDESCRICAO, PS.PS_PDDATAINICIOTEMPORADA, "
    strSql += "         PS.PS_PDDATAFIMTEMPORADA, PS.PS_PSOBSERVACAO, PS.PS_PSATIVO, PS.PS_PSDATACADASTRO "
    strSql += " FROM	futmesacartola.PARAMETROSSISTEMAS PS "

    console.log(strSql);
    const connection = mysql.createConnection(config)
    connection.query(strSql,( err, rows, fields) =>{
        connection.destroy();
        if (err) {return res.status(500).send({ error: err}) }
        if (rows.length < 1){ 
            const response = {
                PS_PSID : null,
                PS_PSDESCRICAO : null,
                PS_PDDATAINICIOTEMPORADA : null,
                PS_PDDATAFIMTEMPORADA : null,
                PS_PSOBSERVACAO : null,
                PS_PSATIVO : null,
                PS_PSDATACADASTRO : null,
            }
            return res.status(200).send(response);
        }
        const response = {
            parametros: rows.map(me => {
                return {
                    PS_PSID : me.PS_PSID,
                    PS_PSDESCRICAO : me.PS_PSDESCRICAO,
                    PS_PDDATAINICIOTEMPORADA : me.PS_PDDATAINICIOTEMPORADA,
                    PS_PDDATAFIMTEMPORADA : me.PS_PDDATAFIMTEMPORADA,
                    PS_PSOBSERVACAO : me.PS_PSOBSERVACAO,
                    PS_PSATIVO : me.PS_PSATIVO,
                    PS_PSDATACADASTRO : me.PS_PSDATACADASTRO,
                }
            })
        }
        return res.status(200).send(response.parametros);
    })
}



