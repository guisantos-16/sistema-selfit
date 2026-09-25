const express = require('express');
const mysql = require('../../config/db');
const router = express.Router();

const validarEquipamento = (req, res, next) => {
    let {
        unidade_nome,
        nome_identificacao,
        categoria,
        marca,
        modelo,
        numero_serie,
        placa_patrimonio,
        localizacao,
        status,
        data_garantia,
        endereco_ip,
        mac_address
    } = req.body;

    // 1. unidade_nome: string válida obrigatória
    if (!unidade_nome || typeof unidade_nome !== 'string' || unidade_nome.trim() === '') {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'O campo "unidade_nome" é obrigatório e deve ser uma string válida.'
        });
    }

    // 2. nome_identificacao: string válida
    if (!nome_identificacao || typeof nome_identificacao !== 'string' || nome_identificacao.trim() === '') {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'O campo "nome_identificacao" é obrigatório e deve ser uma string válida.'
        });
    }

    // 3. categoria: string válida
    if (!categoria || typeof categoria !== 'string' || categoria.trim() === '') {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'O campo "categoria" é obrigatório e deve ser uma string válida.'
        });
    }

    // 4. marca: string válida
    if (!marca || typeof marca !== 'string' || marca.trim() === '') {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'O campo "marca" é obrigatório e deve ser uma string válida.'
        });
    }

    // 5. modelo: string válida
    if (!modelo || typeof modelo !== 'string' || modelo.trim() === '') {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'O campo "modelo" é obrigatório e deve ser uma string válida.'
        });
    }

    // 6. numero_serie: string válida
    if (!numero_serie || typeof numero_serie !== 'string' || numero_serie.trim() === '') {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'O campo "numero_serie" é obrigatório e deve ser uma string válida.'
        });
    }

    // 7. placa_patrimonio: string válida
    if (!placa_patrimonio || typeof placa_patrimonio !== 'string' || placa_patrimonio.trim() === '') {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'O campo "placa_patrimonio" é obrigatório e deve ser uma string válida.'
        });
    }

    // 8. localizacao: string válida
    if (!localizacao || typeof localizacao !== 'string' || localizacao.trim() === '') {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'O campo "localizacao" é obrigatório e deve ser uma string válida.'
        });
    }

    // 9. status (opcional)
    if (status !== undefined && (typeof status !== 'string' || status.trim() === '')) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'O campo "status" deve ser uma string válida.'
        });
    }

    // 10. data_garantia: string/data válida
    if (!data_garantia || typeof data_garantia !== 'string' || data_garantia.trim() === '') {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'O campo "data_garantia" é obrigatório e deve ser uma data válida (ex: "2028-12-31").'
        });
    }

    // 11. endereco_ip (opcional)
    if (endereco_ip !== undefined && endereco_ip !== null && (typeof endereco_ip !== 'string' || endereco_ip.trim() === '')) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'O campo "endereco_ip" deve ser uma string válida.'
        });
    }

    // 12. mac_address (opcional)
    if (mac_address !== undefined && mac_address !== null && (typeof mac_address !== 'string' || mac_address.trim() === '')) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'O campo "mac_address" deve ser uma string válida.'
        });
    }

    // Sanitização e reatribuição limpa (maiúsculas para textos)
    req.body.unidade_nome = unidade_nome.trim().toUpperCase();
    req.body.nome_identificacao = nome_identificacao.trim().toUpperCase();
    req.body.categoria = categoria.trim().toUpperCase();
    req.body.marca = marca.trim().toUpperCase();
    req.body.modelo = modelo.trim().toUpperCase();
    req.body.numero_serie = numero_serie.trim().toUpperCase();
    req.body.placa_patrimonio = placa_patrimonio.trim().toUpperCase();
    req.body.localizacao = localizacao.trim().toUpperCase();

    if (status) {
        req.body.status = status.trim().toUpperCase();
    }
    if (endereco_ip) {
        req.body.endereco_ip = endereco_ip.trim();
    }
    if (mac_address) {
        req.body.mac_address = mac_address.trim().toUpperCase();
    }

    next();
};

/**
 * @swagger
 * /register/equipamentos:
 *   post:
 *     summary: Cadastra um novo equipamento vinculado a uma unidade pelo nome
 *     description: Recebe o nome da unidade e dados do equipamento, busca o ID da unidade no banco, valida tipos estritos e salva o equipamento.
 *     tags: [Cadastros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - unidade_nome
 *               - nome_identificacao
 *               - categoria
 *               - marca
 *               - modelo
 *               - numero_serie
 *               - placa_patrimonio
 *               - localizacao
 *               - data_garantia
 *             properties:
 *               unidade_nome:
 *                 type: string
 *                 description: Nome da unidade à qual o equipamento pertence (será buscado no banco).
 *                 example: "BOA VIAGEM II"
 *               nome_identificacao:
 *                 type: string
 *                 description: Nome ou tag de identificação do equipamento.
 *                 example: "COMPUTADOR-SUPORTE-01"
 *               categoria:
 *                 type: string
 *                 description: Categoria do equipamento.
 *                 example: "INFORMATICA"
 *               marca:
 *                 type: string
 *                 description: Marca do fabricante.
 *                 example: "DELL"
 *               modelo:
 *                 type: string
 *                 description: Modelo do equipamento.
 *                 example: "LATITUDE 3420"
 *               numero_serie:
 *                 type: string
 *                 description: Número de série único do equipamento.
 *                 example: "DLL987654321"
 *               placa_patrimonio:
 *                 type: string
 *                 description: Número da placa de patrimônio única.
 *                 example: "PAT-2026-00123"
 *               localizacao:
 *                 type: string
 *                 description: Local físico onde o equipamento está instalado.
 *                 example: "SALA DE TI"
 *               status:
 *                 type: string
 *                 description: Status operacional do equipamento (padrão ATIVO).
 *                 example: "ATIVO"
 *               data_garantia:
 *                 type: string
 *                 format: date
 *                 description: Data de término da garantia (YYYY-MM-DD).
 *                 example: "2028-12-31"
 *               endereco_ip:
 *                 type: string
 *                 description: Endereço IP na rede (opcional).
 *                 example: "192.168.1.50"
 *               mac_address:
 *                 type: string
 *                 description: Endereço MAC da placa de rede (opcional).
 *                 example: "00:1A:2B:3C:4D:5E"
 *     responses:
 *       201:
 *         description: Equipamento cadastrado com sucesso!
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
 *                   example: "Equipamento cadastrado com sucesso!"
 *       400:
 *         description: Erro de validação, unidade não encontrada ou registro duplicado.
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
 *                   example: "A unidade informada não está cadastrada no sistema."
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

router.post('/register/equipamentos', validarEquipamento, async (req, res) => {
    const {
        unidade_nome,
        nome_identificacao,
        categoria,
        marca,
        modelo,
        numero_serie,
        placa_patrimonio,
        localizacao,
        status,
        data_garantia,
        endereco_ip,
        mac_address
    } = req.body;

    try {
        // 1. Busca a unidade no banco pelo nome para obter o seu ID real
        const [unidades] = await mysql.query(
            'SELECT id FROM unidades WHERE nome = ?',
            [unidade_nome]
        );

        if (unidades.length === 0) {
            return res.status(400).json({
                sucesso: false,
                message: 'A unidade informada não está cadastrada no sistema.'
            });
        }

        const unidade_id = unidades[0].id;

        // 2. Realiza o cadastro do equipamento utilizando o ID encontrado
        await mysql.query(
            `INSERT INTO equipamentos 
            (unidade_id, nome_identificacao, categoria, marca, modelo, numero_serie, placa_patrimonio, localizacao, status, data_garantia, endereco_ip, mac_address) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                unidade_id,
                nome_identificacao,
                categoria,
                marca,
                modelo,
                numero_serie,
                placa_patrimonio,
                localizacao,
                status || 'ATIVO',
                data_garantia,
                endereco_ip || null,
                mac_address || null
            ]
        );

        return res.status(201).json({
            sucesso: true,
            message: 'Equipamento cadastrado com sucesso!'
        });
    } catch (error) {
        // Tratamento para dados duplicados (Erro 1062 do MySQL - Unique constraint)
        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
            let mensagemErro = 'Registro duplicado.';

            if (error.sqlMessage && error.sqlMessage.includes('numero_serie')) {
                mensagemErro = 'Já existe um equipamento cadastrado com este número de série.';
            } else if (error.sqlMessage && error.sqlMessage.includes('placa_patrimonio')) {
                mensagemErro = 'Já existe um equipamento cadastrado com esta placa de patrimônio.';
            } else {
                mensagemErro = 'Já existe um equipamento cadastrado com estes dados.';
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
