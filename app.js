const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
var cors = require('cors')

const rotaClubes = require('./routes/clubes');
const rotaUsuarios = require('./routes/usuario')
const rotaGrupoUsuario = require('./routes/grupousuario')
const rotaEstados = require('./routes/estados');
const rotaJogador = require('./routes/jogador')
const rotaRodada = require('./routes/rodada')
const rotaCategoriaJogo = require('./routes/categoriajogo')
const rotaCompeticao = require('./routes/competicao')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(morgan('dev'));
app.use('/clubes',rotaClubes);
app.use('/usuario',rotaUsuarios);
app.use('/grupousuario',rotaGrupoUsuario);
app.use('/estados',rotaEstados);
app.use('/jogador',rotaJogador);
app.use('/rodada',rotaRodada);
app.use('/categoriajogo',rotaCategoriaJogo);
app.use('/competicao',rotaCompeticao);


module.exports = app;