const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
var cors = require('cors')

const rotaClubes = require('./routes/clubes');
const rotaUsuarios = require('./routes/usuario')
const rotaGrupoUsuario = require('./routes/grupousuario')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(morgan('dev'));
app.use('/clubes',rotaClubes);
app.use('/usuario',rotaUsuarios);
app.use('/grupousuario',rotaGrupoUsuario);

// app.use((req, res, next) => {
//     const erro = new Error('Não encontrado');
//     erro.status = 404;
//     next(erro);
// });

// app.use((error, req, res, next) =>{
//     res.status(error.status || 500);
//     return res.send({
//         erro: {
//             mensagem: error.message
//         }
//     })
// })

module.exports = app;