const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
var cors = require('cors')

const rotaClubes = require('./routes/clubes');
const rotaUsuarios = require('./routes/usuario')
const rotaGrupoUsuario = require('./routes/grupousuario')
const rotaEstados = require('./routes/estados');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(morgan('dev'));
app.use('/clubes',rotaClubes);
app.use('/usuario',rotaUsuarios);
app.use('/grupousuario',rotaGrupoUsuario);
app.use('/estados',rotaEstados);


module.exports = app;