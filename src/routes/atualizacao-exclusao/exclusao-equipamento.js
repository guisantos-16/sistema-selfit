const express = require('express');
const mysql = require('../../config/db');
const router = express.Router();

/**
 * @swagger
 * /equipamentos/{id}:
 *   delete:
 *     summary: Realiza a exclusão lógica (Soft Delete) de um equipamento.
 *     description: Marca o equipamento como excluído preenchendo o campo 'deleted_at' com a data e hora atuais, preservando o histórico no banco de dados.
 *     tags: [Atualização e Exclusão]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único do equipamento que será excluído.
 *         example: 1
 *     responses:
 *       200:
 *         description: Equipamento excluído com sucesso.
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
 *                   example: "Equipamento excluído com sucesso!"
 *       404:
 *         description: Equipamento não encontrado ou já se encontra excluído.
 *       500:
 *         description: Erro interno do servidor.
 */
router.delete('/equipamentos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // 1. Verifica se o equipamento existe e se já não foi excluído anteriormente
        const [equipamento] = await mysql.query(
            'SELECT id FROM equipamentos WHERE id = ? AND deleted_at IS NULL',
            [id]
        );

        if (equipamento.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Equipamento não encontrado ou já foi excluído anteriormente.'
            });
        }

        // 2. Executa o Soft Delete atualizando o deleted_at
        await mysql.query(
            'UPDATE equipamentos SET deleted_at = NOW() WHERE id = ?',
            [id]
        );

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Equipamento excluído com sucesso!'
        });

    } catch (error) {
        console.error("ERRO AO EXCLUIR EQUIPAMENTO:", error);
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno do servidor.'
        });
    }
});

module.exports = router;