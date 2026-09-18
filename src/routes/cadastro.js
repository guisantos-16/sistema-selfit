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

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Cadastra um novo usuário
 *     description: Recebe usuário e senha, criptografa a senha com bcrypt e salva no banco de dados MySQL.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario
 *               - senha
 *             properties:
 *               usuario:
 *                 type: string
 *                 description: Nome de usuário para o cadastro.
 *                 example: "yvson.jose"
 *               senha:
 *                 type: string
 *                 description: Senha do usuário (será criptografada).
 *                 example: "senha-ficticia"
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário cadastrado!"
 *       500:
 *         description: Erro interno do servidor (falha ao salvar no banco ou hash).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro interno do servidor."
 */

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

