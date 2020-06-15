const mysql = require('mysql');
const config = require('../config');

exports.GetAllCompeticoes = (req,res) => {
    console.log(req.usuario);
    const connection = mysql.createConnection(config)
    connection.query("SELECT * FROM COMPETICOES",( err, rows, fields) =>{
        if (err) {return res.status(500).send({ error: err}) }
        res.json(rows)
        connection.destroy();
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
    if (req.body.CL_CLATIVO == ''){
        blnAtivo = false
    }else
    {
        blnAtivo = true
    }
    strSql = "UPDATE CLUBES SET CL_CLNOME = ? ,CL_CLENDERECO = ? , CL_CLCIDADE = ? ,CL_CLUF = ? "
    strSql = strSql + ",CL_CLATIVO = ? ,CL_CLSIGLA = ?, CL_CLEMBLEMA = ? , ";
    strSql = strSql + " CL_CLEMAIL = ? , CL_CLRESPONSAVEL = ? ,CL_CLDATACADASTRO = ? ,CL_CLTELEFONE = ?  ";
    strSql = strSql + " WHERE CL_CLID = ? ";
    console.log(strSql);
    const connection = mysql.createConnection(config)
    connection.query(strSql,[req.body.CL_CLNOME,req.body.CL_CLENDERECO,req.body.CL_CLCIDADE,req.body.CL_CLUF,blnAtivo
                            ,req.body.CL_CLSIGLA,req.body.CL_CLEMBLEMA,req.body.CL_CLEMAIL,req.body.CL_CLRESPONSAVEL,
                                req.body.CL_CLDATACADASTRO,req.body.CL_CLTELEFONE, req.body.CL_CLID],( err, results, fields) =>{
        if (err){
            console.log(err)
            res.sendStatus(500)
            connection.destroy();
            res.end();
            return false;
        }

        console.log("Clube ALTERADO com sucesso com o id:", results.insertedId)
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
    strSql = "SELECT * FROM CLUBES WHERE CL_CLID = ? ";
    console.log(strSql);
    const connection = mysql.createConnection(config)
    connection.query(strSql,[req.params.id],( err, rows, fields) =>{
        connection.destroy();
        if (err) {return res.status(500).send({ error: err}) }
        if (rows.length < 1){ return res.status(401).send({ mensagem: 'Nenhum clube encontrado'})}
        const response = {
            CL_CLID : rows[0].CL_CLID,
            CL_CLNOME  : rows[0].CL_CLNOME,
            CL_CLENDERECO    : rows[0].CL_CLENDERECO,
            CL_CLCIDADE : rows[0].CL_CLCIDADE,
            CL_CLUF : rows[0].CL_CLUF,
            CL_CLATIVO : rows[0].CL_CLATIVO,
            CL_CLSIGLA  : rows[0].CL_CLSIGLA,
            CL_CLEMBLEMA : rows[0].CL_CLEMBLEMA,
            CL_CLEMAIL : rows[0].CL_CLEMAIL,
            CL_CLRESPONSAVEL : rows[0].CL_CLRESPONSAVEL,
            CL_CLDATACADASTRO : rows[0].CL_CLDATACADASTRO,
            CL_CLTELEFONE : rows[0].CL_CLTELEFONE,
        }
        return res.status(200).send(response);

    })
}