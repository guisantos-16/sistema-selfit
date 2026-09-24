const express = require('express');
const mysql = require('../../config/db');
const router = express.Router();

/**
 * @swagger
 * /equipamentos/garantia:
 *   get:
 *     summary: Consulta de equipamentos na garantia por categoria e nome/identificação.
 *     description: Retorna a lista de equipamentos para o front-end exibir os indicadores de garantia (ativa ou vencida), permitindo filtrar por categoria e buscar pelo nome de identificação, número de série ou patrimônio.
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
 *         description: Termo de busca focado no nome de identificação (ex. BOA VIAGEM II - FACIAL 01), série ou patrimônio.
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
 *                         example: "BOA VIAGEM II - FACIAL 01"
 *                       categoria:
 *                         type: string
 *                         example: "CAMERAS"
 *                       numero_serie:
 *                         type: string
 *                         example: "FAC123456789"
 *                       placa_patrimonio:
 *                         type: string
 *                         example: "PAT-FAC-001"
 *                       data_garantia:
 *                         type: string
 *                         format: date
 *                         example: "2028-12-31"
 *       500:
 *         description: Erro interno do servidor.
 */
router.get('/equipamentos/garantia', async (req, res) => {
    let { categoria, busca } = req.query;

    try {
        let query = `
            SELECT e.id, u.nome AS unidade_nome, e.nome_identificacao, e.categoria, 
                   e.marca, e.modelo, e.numero_serie, e.placa_patrimonio, 
                   e.localizacao, e.status, e.data_garantia
            FROM equipamentos e
            JOIN unidades u ON e.unidade_id = u.id
            WHERE e.deleted_at IS NULL 
              AND e.data_garantia >= CURDATE()
        `;
        let params = [];

        // Filtro por categoria (ex: TV, CAMERAS)
        if (categoria && typeof categoria === 'string' && categoria.trim() !== '') {
            query += ` AND e.categoria = ?`;
            params.push(categoria.trim().toUpperCase());
        }

        // Busca focada prioritariamente no nome de identificação (mas abrangendo série/patrimônio por segurança)
        if (busca && typeof busca === 'string' && busca.trim() !== '') {
            const termoBusca = `%${busca.trim().toUpperCase()}%`;
            query += ` AND (e.nome_identificacao LIKE ? OR e.numero_serie LIKE ? OR e.placa_patrimonio LIKE ?)`;
            params.push(termoBusca, termoBusca, termoBusca);
        }

        query += ` ORDER BY e.data_garantia ASC`;

        const [equipamentos] = await mysql.query(query, params);

        return res.status(200).json({
            sucesso: true,
            total: equipamentos.length,
            dados: equipamentos
        });

    } catch (error) {
        console.error("ERRO AO CONSULTAR GARANTIAS:", error);
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno do servidor.'
        });
    }
});

module.exports = router;