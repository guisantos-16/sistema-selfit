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

    // 2. CNPJ: tratado como string, removendo caracteres não numéricos
    const cnpjStr = String(cnpj || '').trim();
    const cnpjLimpo = cnpjStr.replace(/\D/g, '');
    if (!cnpjLimpo || cnpjLimpo.length !== 14) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'O campo "cnpj" é obrigatório e deve conter exatamente 14 dígitos numéricos.'
        });
    }

    // 3. CEP: tratado como string, preservando zeros à esquerda e removendo traços/pontos
    const cepStr = String(cep || '').trim();
    const cepLimpo = cepStr.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'O campo "cep" é obrigatório e deve conter exatamente 8 dígitos.'
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

    // 7. Número: tratado como string (aceita números, letras e "S/N")
    const numeroStr = String(numero || '').trim();
    if (!numeroStr) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'O campo "numero" é obrigatório e deve ser uma string válida.'
        });
    }

    // Sanitização e reatribuição limpa (tudo em string, pontas limpas e texto em maiúsculo)
    req.body.nome = nome.trim().toUpperCase();
    req.body.cnpj = cnpjLimpo;
    req.body.cep = cepLimpo;
    req.body.uf = uf.trim().toUpperCase();
    req.body.bairro = bairro.trim().toUpperCase();
    req.body.rua = rua.trim().toUpperCase();
    req.body.numero = numeroStr.toUpperCase();

    next();
};

/**
 * @swagger
 * /register/unidades:
 *   post:
 *     summary: Cadastra uma nova unidade
 *     description: Recebe os dados da unidade como string, limpa espaços nas pontas, padroniza textos para maiúsculas e salva no MySQL.
 *     tags: [Cadastros]
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
 *                 description: Nome da unidade (convertido para maiúsculas).
 *                 example: "BOA VIAGEM II"
 *               cnpj:
 *                 type: string
 *                 description: CNPJ da unidade (apenas números, sem pontuação).
 *                 example: "12345678000195"
 *               cep:
 *                 type: string
 *                 description: CEP da unidade (apenas números, preservando zeros à esquerda).
 *                 example: "05020280"
 *               uf:
 *                 type: string
 *                 description: Sigla do estado com exatamente 2 caracteres.
 *                 example: "PE"
 *               bairro:
 *                 type: string
 *                 description: Nome do bairro (convertido para maiúsculas).
 *                 example: "BOA VIAGEM"
 *               rua:
 *                 type: string
 *                 description: Nome da rua ou avenida (convertido para maiúsculas).
 *                 example: "RUA BRUNO VELOSO"
 *               numero:
 *                 type: string
 *                 description: Número do endereço (pode conter números ou complementos como S/N).
 *                 example: "1000"
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
 *         description: Erro de validação ou registro duplicado.
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
 *                   example: "O campo 'cnpj' é obrigatório e deve conter exatamente 14 dígitos numéricos."
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