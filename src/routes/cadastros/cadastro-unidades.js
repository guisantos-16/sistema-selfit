const express = require('express');
const mysql = require('../../config/db');
const router = express.Router();

const validarUnidade = (req, res, next) => {
    let { nome, cnpj, cep, uf, bairro, rua, numero } = req.body;

    // 1. Nome: string válida, sem espaços vazios nas pontas
    if (!nome || typeof nome !== 'string' || nome.trim() === '') {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'O campo "nome" é obrigatório e deve ser uma string válida.'
        });
    }

    // 2. CNPJ: estritamente número (sem letras)
    if (cnpj === undefined || cnpj === null || typeof cnpj !== 'number') {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'O campo "cnpj" é obrigatório e deve ser um número válido (sem letras ou espaços).'
        });
    }

    // 3. CEP: estritamente número
    if (cep === undefined || cep === null || typeof cep !== 'number') {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'O campo "cep" é obrigatório e deve ser um número válido.'
        });
    }

    // 4. UF: string válida com exatamente 2 caracteres
    if (!uf || typeof uf !== 'string' || uf.trim().length !== 2) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'O campo "uf" é obrigatório e deve ter exatamente 2 caracteres (ex: SP, RJ).'
        });
    }

    // 5. Bairro: string válida, sem espaços vazios nas pontas
    if (!bairro || typeof bairro !== 'string' || bairro.trim() === '') {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'O campo "bairro" é obrigatório e deve ser uma string válida.'
        });
    }

    // 6. Rua: string válida, sem espaços vazios nas pontas
    if (!rua || typeof rua !== 'string' || rua.trim() === '') {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'O campo "rua" é obrigatório e deve ser uma string válida.'
        });
    }

    // 7. Número: estritamente número
    if (numero === undefined || numero === null || typeof numero !== 'number') {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'O campo "numero" é obrigatório e deve ser um número válido.'
        });
    }

    // Sanitização e reatribuição limpa (sem espaços nas pontas e em maiúsculo para strings)
    req.body.nome = nome.trim().toUpperCase();
    req.body.uf = uf.trim().toUpperCase();
    req.body.bairro = bairro.trim().toUpperCase();
    req.body.rua = rua.trim().toUpperCase();

    next();
};

/**
 * @swagger
 * /register/unidades:
 *   post:
 *     summary: Cadastra uma nova unidade
 *     description: Recebe os dados da unidade, valida tipos estritos, remove espaços nas pontas, converte textos para maiúsculas e salva no banco de dados MySQL.
 *     tags: [Unidades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - cnpj
 *               - cep
 *               - uf
 *               - bairro
 *               - rua
 *               - numero
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome da unidade (será convertido para maiúsculas).
 *                 example: "BOA VIAGEM II"
 *               cnpj:
 *                 type: integer
 *                 description: CNPJ da unidade (estritamente numérico, sem letras ou pontuação).
 *                 example: 12345678000195
 *               cep:
 *                 type: integer
 *                 description: CEP da unidade (estritamente numérico).
 *                 example: 51020280
 *               uf:
 *                 type: string
 *                 description: Sigla do estado com exatamente 2 caracteres (convertida para maiúsculas).
 *                 example: "PE"
 *               bairro:
 *                 type: string
 *                 description: Nome do bairro (será convertido para maiúsculas).
 *                 example: "BOA VIAGEM"
 *               rua:
 *                 type: string
 *                 description: Nome da rua ou avenida (será convertido para maiúsculas).
 *                 example: "RUA BRUNO VELOSO"
 *               numero:
 *                 type: integer
 *                 description: Número do endereço (estritamente numérico).
 *                 example: 1000
 *     responses:
 *       201:
 *         description: Unidade cadastrada com sucesso!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Unidade cadastrada com sucesso!"
 *       400:
 *         description: Erro de validação ou registro duplicado (CNPJ ou nome já existentes).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Já existe uma unidade cadastrada com este CNPJ."
 *       500:
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Erro interno do servidor."
 */

router.post('/register/unidades', validarUnidade, async (req, res) => {
    const { nome, cnpj, cep, uf, bairro, rua, numero } = req.body;

    try {
        await mysql.query(
            'INSERT INTO unidades (nome, cnpj, cep, uf, bairro, rua, numero) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [nome, cnpj, cep, uf, bairro, rua, numero]
        );

        return res.status(201).json({
            sucesso: true,
            message: 'Unidade cadastrada com sucesso!'
        });
    } catch (error) {
        // Tratamento para dados duplicados (Erro 1062 do MySQL - Unique constraint)
        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
            let mensagemErro = 'Registro duplicado.';

            // Identifica qual campo gerou a duplicidade se vier na mensagem do banco
            if (error.sqlMessage && error.sqlMessage.includes('cnpj')) {
                mensagemErro = 'Já existe uma unidade cadastrada com este CNPJ.';
            } else if (error.sqlMessage && error.sqlMessage.includes('nome')) {
                mensagemErro = 'Já existe uma unidade cadastrada com este nome.';
            } else {
                mensagemErro = 'Já existe uma unidade cadastrada com estes dados.';
            }

            return res.status(400).json({
                sucesso: false,
                message: mensagemErro
            });
        }

        console.error("ERRO DETALHADO:", error);

        return res.status(500).json({
            sucesso: false,
            message: 'Erro interno do servidor.'
        });
    }
});

module.exports = router;