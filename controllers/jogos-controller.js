const mysql = require('mysql');
const config = require('../config');

exports.GetAllJogos = (req,res) => {
    console.log(req.usuario);
    const connection = mysql.createConnection(config)
    strSql : String;
    strSql = "SELECT    JG.JG_JGID,         JG.JG_CPID,             JG.JG_CLID1,        JG.JG_JGPTS1,       JG.JG_JGPG1, "    	
    strSql = strSql + " JG.JG_JGSG1,        JG.JG_JGVITORIA1,       JG.JG_JGEMPATE1,    JG.JG_DERROTA1, "
    strSql = strSql + " JG.JG_CLID2,        JG.JG_JGPTS2,           JG.JG_JGPG2,        JG.JG_JGSG2, "
    strSql = strSql + " JG.JG_JGVITORIA2,   JG.JG_JGEMPATE2,        JG.JG_DERROTA2, "
    strSql = strSql + " JG.JG_JGATIVO,      JG.JG_JGDATACADASTRO, "
    strSql = strSql + " CL1.CL_CLNOME AS CL1_CLNOME, CL1.CL_CLSIGLA AS CL1_CLSIGLA, CL1.CL_CLEMBLEMA AS CL1_CLEMBLEMA, "
    strSql = strSql + " CL2.CL_CLNOME AS CL2_CLNOME, CL2.CL_CLSIGLA AS CL2_CLSIGLA, CL2.CL_CLEMBLEMA AS CL2_CLEMBLEMA, "
    strSql = strSql + " CP.CP_CPID, CP_CPDESCRICAO, CP_CPFOTO "
    strSql = strSql + " FROM	JOGOSCLUBES JG "
    strSql = strSql + " JOIN	CLUBES CL1 ON JG.JG_CLID1 = CL1.CL_CLID "
    strSql = strSql + " JOIN	CLUBES CL2 ON JG.JG_CLID2 = CL2.CL_CLID "
    strSql = strSql + " JOIN	COMPETICOES CP ON JG.JG_CPID = CP.CP_CPID  "
    connection.query(strSql,( err, rows, fields) =>{
        connection.destroy();
        if (err) {return res.status(500).send({ error: err}) }
        if (rows.length < 1){ return res.status(401).send({ mensagem: 'Nenhum usuario encontrado'})}
        const response = {
            jogadores: rows.map(jo => {
                return {
                    JG_JGID : jo.JG_JGID,
                    JG_CPID: jo.JG_CPID,
                     OBJ_COMPETICAO : {
                        CP_CPID : jo.JG_CPID,
                        CP_CPDESCRICAO  : jo.CP_CPDESCRICAO,
                        CP_CPFOTO  : jo.CP_CPFOTO,
                    },
                    JG_CLID1 : jo.JG_CLID1,
                    OBJ_CLUBE1 : {
                        CL_CLID : jo.JG_CLID1,
                        CL_CLNOME  : jo.CL1_CLNOME,
                        CL_CLSIGLA  : jo.CL1_CLSIGLA,
                        CL_CLEMBLEMA : jo.CL1_CLEMBLEMA,
                    },
                    JG_JGPTS1 : jo.JG_JGPTS1,
                    JG_JGPG1 : jo.JG_JGPG1,
                    JG_JGSG1 : jo.JG_JGSG1,
                    JG_JGVITORIA1 : jo.JG_JGVITORIA1,
                    JG_JGEMPATE1 : jo.JG_JGEMPATE1,
                    JG_DERROTA1 : jo.JG_DERROTA1,
                    JG_CLID2 : jo.JG_CLID2,
                    OBJ_CLUBE2 : {
                        CL_CLID : jo.JG_CLID2,
                        CL_CLNOME  : jo.CL2_CLNOME,
                        CL_CLSIGLA  : jo.CL2_CLSIGLA,
                        CL_CLEMBLEMA : jo.CL2_CLEMBLEMA,
                    },
                    JG_JGPTS2 : jo.JG_JGPTS2,
                    JG_JGPG2 : jo.JG_JGPG2,
                    JG_JGSG2 : jo.JG_JGSG2,
                    JG_JGVITORIA2 : jo.JG_JGVITORIA2,
                    JG_JGEMPATE2 : jo.JG_JGEMPATE2,
                    JG_DERROTA2 : jo.JG_DERROTA2,
                    JG_JGATIVO : jo.JG_JGATIVO,
                    JG_JGDATACADASTRO : jo.JG_JGDATACADASTRO
                }
            })
        }
        return res.status(200).send(response.jogadores);
    }
    )
}

exports.GetIdJogo = (req,res) => {
    strSql : String;
    const connection = mysql.createConnection(config)
    strSql = "SELECT    JG.JG_JGID,         JG.JG_CPID,             JG.JG_CLID1,        JG.JG_JGPTS1,       JG.JG_JGPG1, "    	
    strSql = strSql + " JG.JG_JGSG1,        JG.JG_JGVITORIA1,       JG.JG_JGEMPATE1,    JG.JG_DERROTA1, "
    strSql = strSql + " JG.JG_CLID2,        JG.JG_JGPTS2,           JG.JG_JGPG2,        JG.JG_JGSG2, "
    strSql = strSql + " JG.JG_JGVITORIA2,   JG.JG_JGEMPATE2,        JG.JG_DERROTA2, "
    strSql = strSql + " JG.JG_JGATIVO,      JG.JG_JGDATACADASTRO,   "
    strSql = strSql + " CL1.CL_CLNOME AS CL1_CLNOME, CL1.CL_CLSIGLA AS CL1_CLSIGLA, CL1.CL_CLEMBLEMA AS CL1_CLEMBLEMA, "
    strSql = strSql + " CL2.CL_CLNOME AS CL2_CLNOME, CL2.CL_CLSIGLA AS CL2_CLSIGLA, CL2.CL_CLEMBLEMA AS CL2_CLEMBLEMA, "
    strSql = strSql + " CP.CP_CPID, CP_CPDESCRICAO, CP_CPFOTO, CP.CP_CPDATAINICIO "
    strSql = strSql + " FROM	JOGOSCLUBES JG "
    strSql = strSql + " JOIN	COMPETICOES CP ON JG.JG_CPID = CP.CP_CPID  "
    strSql = strSql + " JOIN	CLUBES CL1 ON JG.JG_CLID1 = CL1.CL_CLID "
    strSql = strSql + " JOIN	CLUBES CL2 ON JG.JG_CLID2 = CL2.CL_CLID "
    strSql = strSql + "  WHERE JG_JGID = ? "

    connection.query(strSql,[req.params.id],( err, rows, fields) =>{
        connection.destroy();
        if (err) {return res.status(500).send({ error: err}) }
        if (rows.length < 1){ return res.status(401).send({ mensagem: 'Nenhum jogador encontrado'})}
        const response = {
            JG_JGID : rows[0].JG_JGID,
            JG_CPID: rows[0].JG_CPID,
            OBJ_COMPETICAO : {
                CP_CPID : rows[0].JG_CPID,
                CP_CPDESCRICAO  : rows[0].CP_CPDESCRICAO,
                CP_CPFOTO  : rows[0].CP_CPFOTO,
                CP_CPDATAINICIO : rows[0].CP_CPDATAINICIO,
            },
            ano: rows[0].CP_CPDATAINICIO.getFullYear(),
            JG_CLID1 : rows[0].JG_CLID1,
            OBJ_CLUBE1 : {
                CL_CLID : rows[0].JG_CLID1,
                CL_CLNOME  : rows[0].CL1_CLNOME,
                CL_CLSIGLA  : rows[0].CL1_CLSIGLA,
                CL_CLEMBLEMA : rows[0].CL1_CLEMBLEMA,
            },
            JG_JGPTS1 : rows[0].JG_JGPTS1,
            JG_JGPG1 : rows[0].JG_JGPG1,
            JG_JGSG1 : rows[0].JG_JGSG1,
            JG_JGVITORIA1 : rows[0].JG_JGVITORIA1,
            JG_JGEMPATE1 : rows[0].JG_JGEMPATE1,
            JG_DERROTA1 : rows[0].JG_DERROTA1,
            JG_CLID2 : rows[0].JG_CLID2,
            OBJ_CLUBE2 : {
                CL_CLID : rows[0].JG_CLID2,
                CL_CLNOME  : rows[0].CL2_CLNOME,
                CL_CLSIGLA  : rows[0].CL2_CLSIGLA,
                CL_CLEMBLEMA : rows[0].CL2_CLEMBLEMA,
            },
            JG_JGPTS2 : rows[0].JG_JGPTS2,
            JG_JGPG2 : rows[0].JG_JGPG2,
            JG_JGSG2 : rows[0].JG_JGSG2,
            JG_JGVITORIA2 : rows[0].JG_JGVITORIA2,
            JG_JGEMPATE2 : rows[0].JG_JGEMPATE2,
            JG_DERROTA2 : rows[0].JG_DERROTA2,
            JG_JGATIVO : rows[0].JG_JGATIVO,
            JG_JGDATACADASTRO : rows[0].JG_JGDATACADASTRO
        }
        console.log(response);
        return res.status(200).send(response);
    })
}

exports.IncluirJogo = (req, res) => {
    strSql : String;
    blnAtivo : Boolean;
    if (req.body.JG_JGATIVO == ''){blnAtivo = false} else{blnAtivo = true}
    strSql = "INSERT INTO JOGOSCLUBES ( ";
    strSql = strSql + " JG_CPID,         JG_CLID1,            JG_JGPTS1,       JG_JGPG1, "    	
    strSql = strSql + " JG_JGSG1,        JG_JGVITORIA1,       JG_JGEMPATE1,    JG_DERROTA1, "
    strSql = strSql + " JG_CLID2,        JG_JGPTS2,           JG_JGPG2,        JG_JGSG2, "
    strSql = strSql + " JG_JGVITORIA2,   JG_JGEMPATE2,        JG_DERROTA2, "
    strSql = strSql + " JG_JGATIVO,      JG_JGDATACADASTRO )"
    strSql = strSql + " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,now())" ;
    const connection = mysql.createConnection(config)
    connection.query(strSql,[req.body.JG_CPID,req.body.JG_CLID1,req.body.JG_JGPTS1, req.body.JG_JGPG1,
        req.body.JG_JGSG1,req.body.JG_JGVITORIA1,req.body.JG_JGEMPATE1, req.body.JG_DERROTA1,
        req.body.JG_CLID2,req.body.JG_JGPTS2,req.body.JG_JGPG2, req.body.JG_JGSG2,
        req.body.JG_JGVITORIA2,req.body.JG_JGEMPATE2,req.body.JG_DERROTA2,
        ,blnAtivo],( err, results, fields) =>{
        if (err) {return res.status(500).send({ error: err}) };
        connection.destroy();
        res.end()
        return true;
    })
}

exports.AlterarJogo = (req, res) => {
    strSql : String;
    blnAtivo : Boolean;
    if (req.body.JO_JOATIVO == ''){blnAtivo = false}else{blnAtivo = true}
    strSql = "UPDATE JOGOSCLUBES SET ";
    strSql = strSql + " JG_CPID = ?,         JG_CLID1 = ?,            JG_JGPTS1 = ?,       JG_JGPG1 = ?, "    	
    strSql = strSql + " JG_JGSG1 = ?,        JG_JGVITORIA1 = ?,       JG_JGEMPATE1 = ?,    JG_DERROTA1 = ?, "
    strSql = strSql + " JG_CLID2 = ?,        JG_JGPTS2 = ?,           JG_JGPG2 = ?,        JG_JGSG2 = ?, "
    strSql = strSql + " JG_JGVITORIA2 = ?,   JG_JGEMPATE2 = ?,        JG_DERROTA2 = ?, "
    strSql = strSql + " JG_JGATIVO = ? "
    strSql = strSql + " WHERE JG_JGID = ? ";
    const connection = mysql.createConnection(config)
    console.log(strSql);
    console.log(req.body.JG_JGID);
    connection.query(strSql,
        [req.body.JG_CPID,req.body.JG_CLID1,req.body.JG_JGPTS1, req.body.JG_JGPG1,
        req.body.JG_JGSG1,req.body.JG_JGVITORIA1,req.body.JG_JGEMPATE1, req.body.JG_DERROTA1,
        req.body.JG_CLID2,req.body.JG_JGPTS2,req.body.JG_JGPG2, req.body.JG_JGSG2,
        req.body.JG_JGVITORIA2,req.body.JG_JGEMPATE2,req.body.JG_DERROTA2
        ,blnAtivo,req.body.JG_JGID],( err, results, fields) =>{
            if (err) {return res.status(500).send({ error: err}) };
            connection.destroy();
            res.end()
            return true;
        })
}

exports.ExcluirJogo = (req, res) => {
    strSql : String;
    blnAtivo : Boolean;
    strSql = "DELETE FROM JOGOSCLUBES WHERE JG_JGID = ? ";
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
            console.log("jogo excluído com sucesso com o id:", results.insertedId)
            res.end()
            connection.destroy();
            return true;
        }
    })
}

exports.TabelaJogos = (req, res) => {
    strSql : String;
    blnAtivo : Boolean;
    strSql = "  SELECT    CP.CP_CPDATAINICIO,CP.CP_CPDESCRICAO, CP.CP_CPFOTO, CP.CP_CPID, "
    strSql += " RO.RO_ROID, RO.RO_RODESCRICAO, "
    strSql += " CL1.CL_CLNOME AS CL1_CLNOME, CL1.CL_CLSIGLA AS CL1_CLSIGLA, CL1.CL_CLEMBLEMA AS CL1_CLEMBLEMA, CL1.CL_CLID AS CL1_CLID, "
    strSql += " CL2.CL_CLNOME AS CL2_CLNOME, CL2.CL_CLSIGLA AS CL2_CLSIGLA, CL2.CL_CLEMBLEMA AS CL2_CLEMBLEMA, CL2.CL_CLID AS CL2_CLID "
    strSql += " FROM   COMPETICOES CP "
    strSql += " JOIN RODADAS RO ON CP.CP_ROID = RO.RO_ROID "
    strSql += " LEFT JOIN	JOGOSCLUBES JG  ON JG.JG_CPID = CP.CP_CPID  "
    strSql += " LEFT JOIN	CLUBES CL1 ON JG.JG_CLID1 = CL1.CL_CLID "
    strSql += " LEFT JOIN	CLUBES CL2 ON JG.JG_CLID2 = CL2.CL_CLID "
    strSql += " ORDER BY     CP_CPDATAINICIO "
    
    console.log(strSql);
    const connection = mysql.createConnection(config)
    connection.query(strSql,( err, rows, fields) =>{
        connection.destroy();
        if (err) {return res.status(500).send({ error: err}) }
        if (rows.length < 1){ 
            const response = {
                JG_JGID : null,
                JG_CPID: jo.CP_CPID,
                OBJ_COMPETICAO : null,
                JG_CLID1 : null,
                JG_JGPTS1 : null,
                JG_JGPG1 : null,
                JG_JGSG1 : null,
                JG_JGVITORIA1 : null,
                JG_JGEMPATE1 : null,
                JG_DERROTA1 : null,
                JG_CLID2 : null,
                OBJ_CLUBE2 : null,
                JG_JGPTS2 : null,
                JG_JGPG2 : null,
                JG_JGSG2 : null,
                JG_JGVITORIA2 : null,
                JG_JGEMPATE2 : null,
                JG_DERROTA2 : null,
                JG_JGATIVO : null,
                JG_JGDATACADASTRO : null
            }
            return res.status(200).send(response);
        }
        const response = {
            maisEscalados: rows.map(jo => {
                return {
                    JG_JGID : null,
                    JG_CPID: jo.CP_CPID,
                     OBJ_COMPETICAO : {
                        CP_CPID : jo.CP_CPID,
                        CP_CPDESCRICAO  : jo.CP_CPDESCRICAO,
                        CP_CPFOTO  : jo.CP_CPFOTO,
                        CP_CPDATAINICIO : jo.CP_CPDATAINICIO,
                        OBJ_Rodada: { 
                            RO_ROID : jo.RO_ROID,
                            RO_RODESCRICAO: jo.RO_RODESCRICAO
                        }
                    },
                    JG_CLID1 : jo.CL1_CLID,
                    OBJ_CLUBE1 : {
                        CL_CLID : jo.CL1_CLID,
                        CL_CLNOME  : jo.CL1_CLNOME,
                        CL_CLSIGLA  : jo.CL1_CLSIGLA,
                        CL_CLEMBLEMA : jo.CL1_CLEMBLEMA,
                    },
                    JG_JGPTS1 : null,
                    JG_JGPG1 : jo.JG_JGPG1,
                    JG_JGSG1 : jo.JG_JGSG1,
                    JG_JGVITORIA1 : jo.JG_JGVITORIA1,
                    JG_JGEMPATE1 : jo.JG_JGEMPATE1,
                    JG_DERROTA1 : jo.JG_DERROTA1,
                    JG_CLID2 : jo.CL2_CLID,
                    OBJ_CLUBE2 : {
                        CL_CLID : jo.CL2_CLID,
                        CL_CLNOME  : jo.CL2_CLNOME,
                        CL_CLSIGLA  : jo.CL2_CLSIGLA,
                        CL_CLEMBLEMA : jo.CL2_CLEMBLEMA,
                    },
                    JG_JGPTS2 : null,
                    JG_JGPG2 : null,
                    JG_JGSG2 : null,
                    JG_JGVITORIA2 : null,
                    JG_JGEMPATE2 : null,
                    JG_DERROTA2 : null,
                    JG_JGATIVO : null,
                    JG_JGDATACADASTRO : null
                }
            })
        }
        return res.status(200).send(response.maisEscalados);
    })
}



