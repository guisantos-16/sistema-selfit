const express = require('express');
const validarAutenticacao = require('../../middleware/validador');
const mysql = require('../../config/db');
const router = express.Router();

router.post('/auth', validarAutenticacao, (req, res) => {
    const { usuario, senha_hash } = req.body;

    return res.status(200).json({
        sucesso: true,
        mensagem: "Dados validados com sucesso!"
    });
});

module.exports = router;