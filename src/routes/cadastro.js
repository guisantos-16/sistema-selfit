const express = require('express');
const mysql = require('../config/db');
const bcrypt = require('bcrypt');
const router = express.Router();

const validarAutenticacao = (req, res, next) => {
    const { usuario, senha } = req.body;

    if (!usuario || typeof usuario !== 'string' || usuario.trim() === '') {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'O campo "usuario" é obrigatório e deve ser uma string válida.'
        });
    }

    if (!senha || typeof senha !== 'string' || senha.trim() === '') {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'O campo "senha" é obrigatório e deve ser uma string válida.'
        });
    }
    next();
}

router.post('/register', validarAutenticacao, async (req, res) => {
    const { usuario, senha } = req.body;

    try {
        const senhaHash = await bcrypt.hash(senha, 10);

        const [rows] = await mysql.query('INSERT INTO usuarios (usuario, senha_hash) VALUES (?, ?)', [usuario, senhaHash]);

        return res.status(201).json({
            message: 'Usuário cadastrado!'
        });
    } catch (error) {
        console.error("ERRO DETALHADO:", error);

        return res.status(500).json({
            message: 'Erro interno do servidor.'
        });
    }
});

module.exports = router;

