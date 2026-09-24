const express = require('express');
const mysql = require('../../config/db');
const router = express.Router();

/**
 * @swagger
 * /equipamentos/manutencao:
 *   get:
 *     summary: Consulta de equipamentos em manutenção por categoria e busca textual.
 *     description: Retorna a lista de equipamentos que estão atualmente em manutenção, permitindo filtrar por categoria e buscar pelo nome de identificação, número de série ou patrimônio.
 *     tags: [Consultas]
 *     parameters:
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         description: Filtra por categoria do equipamento (ex. TV, CAMERAS, INFORMATICA).
 *         example: "CAMERAS"
 *       - in: query
 *         name: busca
 *         schema:
 *           type: string
 *         description: Termo de busca focado no nome de identificação (ex. BOA VIAGEM II - CÂMERA 02), série ou patrimônio.
 *         example: "BOA VIAGEM II"
 *     responses:
 *       200:
 *         description: Dados retornados com sucesso para processamento no front-end.
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
 *                         example: "BOA VIAGEM II - CÂMERA 02"
 *                       categoria:
 *                         type: string
 *                         example: "CAMERAS"
 *                       numero_serie:
 *                         type: string
 *                         example: "CAM123456789"
 *                       placa_patrimonio:
 *                         type: string
 *                         example: "PAT-CAM-002"
 *                       status_equipamento:
 *                         type: string
 *                         example: "EM MANUTENÇÃO"
 *                       descricao_manutencao:
 *                         type: string
 *                         example: "TROCA DE LENTE E AJUSTE DE FOCO"
 *                       data_envio:
 *                         type: string
 *                         format: date
 *                         example: "2026-06-10"
 *       500:
 *         description: Erro interno do servidor.
 */
router.get('/equipamentos/manutencao', async (req, res) => {
    let { categoria, busca } = req.query;

    try {
        // Query que cruza equipamentos com a tabela de manutenções abertas
        let query = `
            SELECT e.id, u.nome AS unidade_nome, e.nome_identificacao, e.categoria, 
                   e.marca, e.modelo, e.numero_serie, e.placa_patrimonio, 
                   e.localizacao, e.status AS status_equipamento,
                   m.id AS manutencao_id, m.descricao AS descricao_manutencao, 
                   m.data_envio, m.status_manutencao
            FROM equipamentos e
            JOIN unidades u ON e.unidade_id = u.id
            JOIN manutencoes m ON e.id = m.equipamento_id
            WHERE e.deleted_at IS NULL 
              AND m.status_manutencao = 'ABERTA'
        `;
        let params = [];

        // Filtro opcional por Categoria
        if (categoria && typeof categoria === 'string' && categoria.trim() !== '') {
            query += ` AND e.categoria = ?`;
            params.push(categoria.trim().toUpperCase());
        }

        // Busca focada em nome de identificação, série ou patrimônio
        if (busca && typeof busca === 'string' && busca.trim() !== '') {
            const termoBusca = `%${busca.trim().toUpperCase()}%`;
            query += ` AND (e.nome_identificacao LIKE ? OR e.numero_serie LIKE ? OR e.placa_patrimonio LIKE ?)`;
            params.push(termoBusca, termoBusca, termoBusca);
        }

        query += ` ORDER BY m.data_envio DESC`;

        const [equipamentos] = await mysql.query(query, params);

        return res.status(200).json({
            sucesso: true,
            total: equipamentos.length,
            dados: equipamentos
        });

    } catch (error) {
        console.error("ERRO AO CONSULTAR MANUTENÇÕES:", error);
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno do servidor.'
        });
    }
});

module.exports = router;