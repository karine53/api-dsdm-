const express = require('express');
const router = express.Router();

const pool = require('../config/database');

// GET /categorias - Listar categorias (com a quantidade de receitas de cada uma)
router.get('/', async (req, res) => {
    try {
        const resultado = await pool.query(
            `SELECT c.id, c.nome, COUNT(r.id)::int AS total_receitas
             FROM categorias c
             LEFT JOIN receitas r ON r.categoria_id = c.id
             GROUP BY c.id, c.nome
             ORDER BY c.nome`
        );

        res.json(resultado.rows);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: 'Erro ao buscar categorias!'
        });
    }
});

module.exports = router;