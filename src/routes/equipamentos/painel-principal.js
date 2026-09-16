const express = require('express');
const router = express.Router();
const mysql = require('../../config/db');

router.get('/painel/equipamentos', async (req, res) => {
    try {
        const query = `
            SELECT 
                (SELECT COUNT(*) FROM unidades) AS total_unidades,
                (SELECT COUNT(*) FROM equipamentos) AS total_equipamentos,
                SUM(CASE WHEN status = 'operacao' THEN 1 ELSE 0 END) AS em_operacao,
                SUM(CASE WHEN status = 'manutencao' THEN 1 ELSE 0 END) AS em_manutencao,
                SUM(CASE WHEN status NOT IN ('operacao', 'manutencao') THEN 1 ELSE 0 END) AS outros
            FROM equipamentos;
        `;

        const [rows] = await mysql.query(query);
        const dados = rows[0];

        return res.status(200).json({
            total_unidades: Number(dados.total_unidades),
            total_equipamentos: Number(dados.total_equipamentos),
            status: {
                em_operacao: Number(dados.em_operacao || 0),
                em_manutencao: Number(dados.em_manutencao || 0),
                outros: Number(dados.outros || 0)
            }
        });

    } catch (error) {
        console.error("Erro ao buscar estatísticas no MySQL:", error);
        return res.status(500).json({ erro: "Erro interno do servidor" });
    }
});

module.exports = router;