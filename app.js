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
const rotaPtsCompeticaoJogador = require('./routes/ptscompeticaojogador')
const rotaEquipe = require('./routes/equipe')
const rotaRanking = require('./routes/ranking')
const rotaEquipeJogador = require('./routes/equipejogador')
const rotaJogos = require('./routes/jogos')

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
app.use('/ptscompeticaojogador',rotaPtsCompeticaoJogador)
app.use('/equipe',rotaEquipe);
app.use('/ranking',rotaRanking);
app.use('/equipejogador',rotaEquipeJogador)
app.use('/jogos',rotaJogos)


module.exports = app;