const express = require('express');
const router = express.Router();

router.get('/',(req, res, next) =>{
    // const clube = {
    //     id : req.body.id,
    //     desc : req.body.desc
    // }
     // const response = {
        // clubes: response.map(prod => {

        // cl_clid: prod.cl_clid})
    //     id : req.body.id,
    //     desc : req.body.desc
    // }
    res.status(200).send({
        mensagem: 'Clubes ativo'
        // clubeCriado: clube
    });
});

router.post('/', (req, res, next) =>{
    res.status(201).send({
        mensagem: 'Clubes post'
    })
})

module.exports = router;