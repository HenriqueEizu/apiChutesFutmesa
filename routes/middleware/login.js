const jwt = require('jsonwebtoken');

exports.obrigatorio = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token,"segredo");
        req.usuario = decode;
        next();
    } catch{
        return res.status(401).send({ mensagem: 'Falha na autenticação'})
    }
}

exports.optional = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token,"segredo");
        req.usuario = decode;
        next();
    } catch{
        next();
    }
}