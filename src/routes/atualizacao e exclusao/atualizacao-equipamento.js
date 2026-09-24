const express = require('express');
const mysql = require('../../config/db');
const router = express.Router();

const validarAtualizacaoEquipamento = (req, res, next) => {
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

    if (unidade_nome !== undefined && (typeof unidade_nome !== 'string' || unidade_nome.trim() === '')) {
        return res.status(400).json({ sucesso: false, mensagem: 'O campo "unidade_nome" deve ser uma string válida.' });
    }
    if (nome_identificacao !== undefined && (typeof nome_identificacao !== 'string' || nome_identificacao.trim() === '')) {
        return res.status(400).json({ sucesso: false, mensagem: 'O campo "nome_identificacao" deve ser uma string válida.' });
    }
    if (categoria !== undefined && (typeof categoria !== 'string' || categoria.trim() === '')) {
        return res.status(400).json({ sucesso: false, mensagem: 'O campo "categoria" deve ser uma string válida.' });
    }
    if (marca !== undefined && (typeof marca !== 'string' || marca.trim() === '')) {
        return res.status(400).json({ sucesso: false, mensagem: 'O campo "marca" deve ser uma string válida.' });
    }
    if (modelo !== undefined && (typeof modelo !== 'string' || modelo.trim() === '')) {
        return res.status(400).json({ sucesso: false, mensagem: 'O campo "modelo" deve ser uma string válida.' });
    }
    if (numero_serie !== undefined && (typeof numero_serie !== 'string' || numero_serie.trim() === '')) {
        return res.status(400).json({ sucesso: false, mensagem: 'O campo "numero_serie" deve ser uma string válida.' });
    }
    if (placa_patrimonio !== undefined && (typeof placa_patrimonio !== 'string' || placa_patrimonio.trim() === '')) {
        return res.status(400).json({ sucesso: false, mensagem: 'O campo "placa_patrimonio" deve ser uma string válida.' });
    }
    if (localizacao !== undefined && (typeof localizacao !== 'string' || localizacao.trim() === '')) {
        return res.status(400).json({ sucesso: false, mensagem: 'O campo "localizacao" deve ser uma string válida.' });
    }
    if (status !== undefined && (typeof status !== 'string' || status.trim() === '')) {
        return res.status(400).json({ sucesso: false, mensagem: 'O campo "status" deve ser uma string válida.' });
    }
    if (data_garantia !== undefined && (typeof data_garantia !== 'string' || data_garantia.trim() === '')) {
        return res.status(400).json({ sucesso: false, mensagem: 'O campo "data_garantia" deve ser uma data válida.' });
    }
    if (endereco_ip !== undefined && endereco_ip !== null && (typeof endereco_ip !== 'string' || endereco_ip.trim() === '')) {
        return res.status(400).json({ sucesso: false, mensagem: 'O campo "endereco_ip" deve ser uma string válida.' });
    }
    if (mac_address !== undefined && mac_address !== null && (typeof mac_address !== 'string' || mac_address.trim() === '')) {
        return res.status(400).json({ sucesso: false, mensagem: 'O campo "mac_address" deve ser uma string válida.' });
    }

    if (unidade_nome) req.body.unidade_nome = unidade_nome.trim().toUpperCase();
    if (nome_identificacao) req.body.nome_identificacao = nome_identificacao.trim().toUpperCase();
    if (categoria) req.body.categoria = categoria.trim().toUpperCase();
    if (marca) req.body.marca = marca.trim().toUpperCase();
    if (modelo) req.body.modelo = modelo.trim().toUpperCase();
    if (numero_serie) req.body.numero_serie = numero_serie.trim().toUpperCase();
    if (placa_patrimonio) req.body.placa_patrimonio = placa_patrimonio.trim().toUpperCase();
    if (localizacao) req.body.localizacao = localizacao.trim().toUpperCase();
    if (status) req.body.status = status.trim().toUpperCase();
    if (endereco_ip) req.body.endereco_ip = endereco_ip.trim();
    if (mac_address) req.body.mac_address = mac_address.trim().toUpperCase();

    next();
};

/**
 * @swagger
 * /equipamentos/{id}:
 *   put:
 *     summary: Atualiza o cadastro de um equipamento existente.
 *     description: Modifica os dados cadastrais de um equipamento pelo seu ID. Permite alterar a unidade informando o nome e garante restrições de unicidade.
 *     tags: [Atualização e Exclusão]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único do equipamento.
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               unidade_nome:
 *                 type: string
 *                 example: "BOA VIAGEM II"
 *               nome_identificacao:
 *                 type: string
 *                 example: "COMPUTADOR-SUPORTE-02"
 *               categoria:
 *                 type: string
 *                 example: "INFORMATICA"
 *               marca:
 *                 type: string
 *                 example: "DELL"
 *               modelo:
 *                 type: string
 *                 example: "LATITUDE 3420"
 *               numero_serie:
 *                 type: string
 *                 example: "DLL987654321"
 *               placa_patrimonio:
 *                 type: string
 *                 example: "PAT-2026-00123"
 *               localizacao:
 *                 type: string
 *                 example: "SALA DE TI"
 *               status:
 *                 type: string
 *                 example: "ATIVO"
 *               data_garantia:
 *                 type: string
 *                 format: date
 *                 example: "2028-12-31"
 *               endereco_ip:
 *                 type: string
 *                 example: "192.168.1.51"
 *               mac_address:
 *                 type: string
 *                 example: "00:1A:2B:3C:4D:5F"
 *     responses:
 *       200:
 *         description: Equipamento atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 mensagem:
 *                   type: string
 *                   example: "Equipamento atualizado com sucesso!"
 *       400:
 *         description: Erro de validação, unidade não encontrada ou duplicidade de série/patrimônio.
 *       404:
 *         description: Equipamento não encontrado ou já excluído.
 *       500:
 *         description: Erro interno do servidor.
 */
router.put('/equipamentos/:id', validarAtualizacaoEquipamento, async (req, res) => {
    const { id } = req.params;
    const dadosAtualizacao = req.body;

    try {
        const [equipamentosExistentes] = await mysql.query(
            'SELECT id FROM equipamentos WHERE id = ? AND deleted_at IS NULL',
            [id]
        );

        if (equipamentosExistentes.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Equipamento não encontrado ou inativo.'
            });
        }

        let unidade_id = undefined;

        if (dadosAtualizacao.unidade_nome) {
            const [unidades] = await mysql.query(
                'SELECT id FROM unidades WHERE nome = ?',
                [dadosAtualizacao.unidade_nome]
            );

            if (unidades.length === 0) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'A unidade informada não está cadastrada no sistema.'
                });
            }
            unidade_id = unidades[0].id;
            delete dadosAtualizacao.unidade_nome;
        }

        const camposParaAtualizar = [];
        const valores = [];

        for (const [campo, valor] of Object.entries(dadosAtualizacao)) {
            camposParaAtualizar.push(`${campo} = ?`);
            valores.push(valor);
        }

        if (unidade_id !== undefined) {
            camposParaAtualizar.push('unidade_id = ?');
            valores.push(unidade_id);
        }

        if (camposParaAtualizar.length === 0) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Nenhum dado foi enviado para atualização.'
            });
        }

        valores.push(id);

        const queryUpdate = `UPDATE equipamentos SET ${camposParaAtualizar.join(', ')} WHERE id = ?`;

        await mysql.query(queryUpdate, valores);

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Equipamento atualizado com sucesso!'
        });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
            let mensagemErro = 'Registro duplicado.';
            if (error.sqlMessage && error.sqlMessage.includes('numero_serie')) {
                mensagemErro = 'Já existe outro equipamento cadastrado com este número de série.';
            } else if (error.sqlMessage && error.sqlMessage.includes('placa_patrimonio')) {
                mensagemErro = 'Já existe outro equipamento cadastrado com esta placa de patrimônio.';
            }
            return res.status(400).json({ sucesso: false, mensagem: mensagemErro });
        }

        console.error("ERRO AO ATUALIZAR EQUIPAMENTO:", error);
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno do servidor.'
        });
    }
});

module.exports = router;