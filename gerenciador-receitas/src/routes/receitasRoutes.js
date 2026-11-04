
const express = require('express');
const router = express.Router();

const pool = require('../config/database');

// Validar os dados da receita
function validarReceita(dados) {
    const {
        nome,
        categoria,
        tempoPreparo,
        porcoes,
        ingredientes,
        modoPreparo
    } = dados;

    if (
        typeof nome !== 'string' || !nome.trim() ||
        typeof categoria !== 'string' || !categoria.trim() ||
        !Number.isInteger(Number(tempoPreparo)) ||
        Number(tempoPreparo) <= 0 ||
        !Number.isInteger(Number(porcoes)) ||
        Number(porcoes) <= 0 ||
        !Array.isArray(ingredientes) ||
        ingredientes.length === 0 ||
        ingredientes.some(i => typeof i !== 'string' || !i.trim()) ||
        typeof modoPreparo !== 'string' || !modoPreparo.trim()
    ) {
        return false;
    }

    return true;
}

// GET - Listar todas as receitas
router.get('/', async (req, res) => {
    try {
        const resultado = await pool.query(
            'SELECT * FROM receitas ORDER BY id'
        );

        res.json(resultado.rows);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: 'Erro ao buscar receitas!'
        });
    }
});

// GET - Buscar receita pelo ID
router.get('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensagem: 'ID inválido!'
            });
        }

        const resultado = await pool.query(
            'SELECT * FROM receitas WHERE id = $1',
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                mensagem: 'Receita não encontrada!'
            });
        }

        res.json(resultado.rows[0]);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: 'Erro ao buscar receita!'
        });
    }
});

// POST - Cadastrar nova receita
router.post('/', async (req, res) => {
    try {
        const {
            nome,
            categoria,
            tempoPreparo,
            porcoes,
            ingredientes,
            modoPreparo
        } = req.body;

        if (!validarReceita(req.body)) {
            return res.status(400).json({
                mensagem: 'Preencha corretamente todos os campos!'
            });
        }

        const resultado = await pool.query(
            `INSERT INTO receitas
            (nome, categoria, tempo_preparo, porcoes, ingredientes, modo_preparo)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                nome.trim(),
                categoria.trim(),
                Number(tempoPreparo),
                Number(porcoes),
                JSON.stringify(ingredientes),
                modoPreparo.trim()
            ]
        );

        res.status(201).json({
            mensagem: 'Receita cadastrada com sucesso!',
            receita: resultado.rows[0]
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: 'Erro ao cadastrar receita!'
        });
    }
});

// PUT - Editar receita
router.put('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensagem: 'ID inválido!'
            });
        }

        if (!validarReceita(req.body)) {
            return res.status(400).json({
                mensagem: 'Preencha corretamente todos os campos!'
            });
        }

        const {
            nome,
            categoria,
            tempoPreparo,
            porcoes,
            ingredientes,
            modoPreparo
        } = req.body;

        const resultado = await pool.query(
            `UPDATE receitas
            SET nome = $1,
                categoria = $2,
                tempo_preparo = $3,
                porcoes = $4,
                ingredientes = $5,
                modo_preparo = $6
            WHERE id = $7
            RETURNING *`,
            [
                nome.trim(),
                categoria.trim(),
                Number(tempoPreparo),
                Number(porcoes),
                JSON.stringify(ingredientes),
                modoPreparo.trim(),
                id
            ]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                mensagem: 'Receita não encontrada!'
            });
        }

        res.json({
            mensagem: 'Receita atualizada com sucesso!',
            receita: resultado.rows[0]
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: 'Erro ao atualizar receita!'
        });
    }
});

// DELETE - Excluir receita
router.delete('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensagem: 'ID inválido!'
            });
        }

        const resultado = await pool.query(
            'DELETE FROM receitas WHERE id = $1 RETURNING *',
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                mensagem: 'Receita não encontrada!'
            });
        }

        res.json({
            mensagem: 'Receita excluída com sucesso!'
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: 'Erro ao excluir receita!'
        });
    }
});

module.exports = router;
