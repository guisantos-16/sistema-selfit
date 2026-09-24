const express = require('express');
const mysql = require('../../config/db');
const router = express.Router();

/**
 * @swagger
 * /equipamentos/consultar:
 *   get:
 *     summary: Consulta geral de equipamentos por nome, número de série ou patrimônio.
 *     description: Permite buscar equipamentos ativos utilizando termos parciais ou exatos no nome de identificação, número de série ou placa de patrimônio.
 *     tags: [Consultas]
 *     parameters:
 *       - in: query
 *         name: busca
 *         required: true
 *         schema:
 *           type: string
 *         description: Termo de busca (Nome do equipamento, número de série ou placa de patrimônio).
 *         example: "BOA VIAGEM II - TV 01"
 *     responses:
 *       200:
 *         description: Consulta realizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 total:
 *                   type: integer
 *                   example: 1
 *                 dados:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       unidade_nome:
 *                         type: string
 *                         example: "BOA VIAGEM II"
 *                       nome_identificacao:
 *                         type: string
 *                         example: "BOA VIAGEM II - TV 01"
 *                       categoria:
 *                         type: string
 *                         example: "TV"
 *                       marca:
 *                         type: string
 *                         example: "SAMSUNG"
 *                       modelo:
 *                         type: string
 *                         example: "CRYSTAL UHD 55"
 *                       numero_serie:
 *                         type: string
 *                         example: "SAM123456789"
 *                       placa_patrimonio:
 *                         type: string
 *                         example: "PAT-TV-001"
 *                       localizacao:
 *                         type: string
 *                         example: "RECEPÇÃO"
 *                       status:
 *                         type: string
 *                         example: "ATIVO"
 *                       data_garantia:
 *                         type: string
 *                         format: date
 *                         example: "2028-12-31"
 *       400:
 *         description: Termo de busca não fornecido ou inválido.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get('/equipamentos/consultar', async (req, res) => {
    let { busca } = req.query;

    if (!busca || typeof busca !== 'string' || busca.trim() === '') {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'O parâmetro de "busca" é obrigatório para realizar a consulta.'
        });
    }

    try {
        const termoBusca = `%${busca.trim().toUpperCase()}%`;

        const query = `
            SELECT e.*, u.nome AS unidade_nome 
            FROM equipamentos e
            JOIN unidades u ON e.unidade_id = u.id
            WHERE e.deleted_at IS NULL 
              AND (e.nome_identificacao LIKE ? OR e.numero_serie LIKE ? OR e.placa_patrimonio LIKE ?)
            ORDER BY e.nome_identificacao ASC
        `;

        const [equipamentos] = await mysql.query(query, [termoBusca, termoBusca, termoBusca]);

        return res.status(200).json({
            sucesso: true,
            total: equipamentos.length,
            dados: equipamentos
        });

    } catch (error) {
        console.error("ERRO NA CONSULTA DE EQUIPAMENTOS:", error);
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno do servidor.'
        });
    }
});

module.exports = router;