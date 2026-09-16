const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('../config/db');
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

router.post('/auth', validarAutenticacao, async (req, res) => {
    const { usuario, senha } = req.body;

    try {
        // 1. Busca o usuário no banco de dados de forma segura (prevenindo SQL Injection)
        const [rows] = await mysql.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);

        // 2. Verifica se o usuário existe
        if (rows.length === 0) {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'Usuário ou senha inválidos.'
            });
        }

        const user = rows[0];

        // 3. Compara a senha enviada com o hash armazenado no banco usando bcrypt
        const senhaValida = await bcrypt.compare(senha, user.senha);

        if (!senhaValida) {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'Usuário ou senha inválidos.'
            });
        }

        // 4. Retorno de sucesso
        return res.status(200).json({
            sucesso: true,
            mensagem: 'Autenticação realizada com sucesso!'
        });

    } catch (error) {
        console.error('Erro no processo de autenticação:', error);
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno no servidor.'
        });
    }
});

module.exports = router;