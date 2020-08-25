const mysql = require('mysql');
const config = require('../config');

exports.GetAllCompeticoes = (req,res) => {
    console.log(req.usuario);
    const connection = mysql.createConnection(config)
    strSql : String;
    strSql = "SELECT	CP.*, RO.RO_RODESCRICAO, CJ.CJ_CJDESCRICAO "
    strSql = strSql + " FROM	COMPETICOES CP "
    strSql = strSql + " JOIN	RODADAS RO ON CP.CP_ROID = RO.RO_ROID "
    strSql = strSql + " JOIN	CATEGORIAJOGO CJ ON CP.CP_CJID = CJ.CJ_CJID; "
    connection.query(strSql,( err, rows, fields) =>{
        connection.destroy();
        if (err) {return res.status(500).send({ error: err}) }
        if (rows.length < 1){ return res.status(401).send({ mensagem: 'Nenhum usuario encontrado'})}
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

exports.GetAnoCompeticao = (req,res) => {
    console.log(req.usuario);
    const connection = mysql.createConnection(config)
    strSql : String;
    strSql = "SELECT	DISTINCT YEAR(CP.CP_CPDATAINICIO) AS ANO "
    strSql = strSql + " FROM	COMPETICOES CP "
    strSql = strSql + " WHERE   CP_CJID = 1 "
    strSql = strSql + " ORDER BY YEAR(CP.CP_CPDATAINICIO) DESC "
    connection.query(strSql,( err, rows, fields) =>{
        connection.destroy();
        if (err) {return res.status(500).send({ error: err}) }
        if (rows.length < 1){ return res.status(401).send({ mensagem: 'Nenhum usuario encontrado'})}
        const response = {
            competicoes: rows.map(cp => {
                return {
                    ANO : cp.ANO,
                }
            })
        }
        return res.status(200).send(response.competicoes);
    }
)}



exports.ExcluirCompeticao = (req, res) => {
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

exports.IncluirCompeticao = (req, res) => {
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

exports.AlterarCompeticao = (req, res) => {
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
        var newpath = 'C:/Users/h_eiz/Documents/chutesfutmesa/src/assets/images/fotosCompeticoes/' + files.fileKey.name;
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

exports.GetCompeticaoId = (req, res) => {
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