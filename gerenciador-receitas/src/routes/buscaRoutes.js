const express = require('express');
const router = express.Router();

const pool = require('../config/database');

// ---------- Funções auxiliares ----------

// Escapa % _ \ para o usuário não conseguir usar curingas do LIKE
function escaparLike(texto) {
    return texto.replace(/[\\%_]/g, '\\$&');
}

// Garante que só chegam os filtros permitidos na query string
function filtrosDesconhecidos(query, permitidos) {
    return Object.keys(query).filter(chave => !permitidos.includes(chave));
}

// Um parâmetro de query precisa ser UMA string (?nome=a&nome=b vira array)
function ehTexto(valor) {
    return typeof valor === 'string';
}

const SELECT_RECEITAS = `
    SELECT r.*, c.nome AS categoria_nome
    FROM receitas r
    LEFT JOIN categorias c ON c.id = r.categoria_id
`;

// ---------- GET /receitas/buscar?nome=bolo ----------
router.get('/buscar', async (req, res) => {
    try {
        const invalidos = filtrosDesconhecidos(req.query, ['nome']);
        if (invalidos.length > 0) {
            return res.status(400).json({
                mensagem: `Filtro(s) não permitido(s): ${invalidos.join(', ')}. Use apenas: nome.`
            });
        }

        const { nome } = req.query;

        if (!ehTexto(nome) || nome.trim().length < 2) {
            return res.status(400).json({
                mensagem: 'Informe o parâmetro "nome" com pelo menos 2 caracteres. Ex: /receitas/buscar?nome=bolo'
            });
        }

        if (nome.trim().length > 100) {
            return res.status(400).json({
                mensagem: 'O parâmetro "nome" pode ter no máximo 100 caracteres.'
            });
        }

        const resultado = await pool.query(
            `${SELECT_RECEITAS}
             WHERE r.nome ILIKE $1
             ORDER BY r.nome`,
            [`%${escaparLike(nome.trim())}%`]
        );

        res.json(resultado.rows);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: 'Erro ao buscar receitas por nome!'
        });
    }
});

// ---------- GET /receitas/filtrar?categoria=Sobremesa&ingredientes=ovo,farinha&modo=todos ----------
// categoria    -> id (número) OU nome da categoria
// ingredientes -> lista separada por vírgula (máx. 10)
// modo         -> "todos" (padrão) ou "qualquer"
router.get('/filtrar', async (req, res) => {
    try {
        const invalidos = filtrosDesconhecidos(req.query, ['categoria', 'ingredientes', 'modo']);
        if (invalidos.length > 0) {
            return res.status(400).json({
                mensagem: `Filtro(s) não permitido(s): ${invalidos.join(', ')}. Use: categoria, ingredientes, modo.`
            });
        }

        const { categoria, ingredientes } = req.query;
        const modo = req.query.modo === undefined ? 'todos' : req.query.modo;

        if (categoria === undefined && ingredientes === undefined) {
            return res.status(400).json({
                mensagem: 'Informe ao menos um filtro: "categoria" ou "ingredientes".'
            });
        }

        if (modo !== 'todos' && modo !== 'qualquer') {
            return res.status(400).json({
                mensagem: 'O parâmetro "modo" deve ser "todos" ou "qualquer".'
            });
        }

        const condicoes = [];
        const valores = [];

        // ----- filtro por categoria -----
        if (categoria !== undefined) {
            if (!ehTexto(categoria) || !categoria.trim()) {
                return res.status(400).json({
                    mensagem: 'O parâmetro "categoria" não pode ser vazio.'
                });
            }

            const cat = categoria.trim();

            if (/^\d+$/.test(cat)) {
                const id = Number(cat);
                if (!Number.isSafeInteger(id) || id <= 0) {
                    return res.status(400).json({ mensagem: 'ID de categoria inválido!' });
                }
                valores.push(id);
                condicoes.push(`r.categoria_id = $${valores.length}`);
            } else {
                if (cat.length > 50) {
                    return res.status(400).json({
                        mensagem: 'O nome da categoria pode ter no máximo 50 caracteres.'
                    });
                }
                valores.push(cat);
                condicoes.push(`LOWER(c.nome) = LOWER($${valores.length})`);
            }
        }

        // ----- filtro por ingredientes -----
        if (ingredientes !== undefined) {
            if (!ehTexto(ingredientes)) {
                return res.status(400).json({
                    mensagem: 'Use "ingredientes" uma única vez, separando os itens por vírgula.'
                });
            }

            const lista = ingredientes
                .split(',')
                .map(i => i.trim())
                .filter(i => i.length > 0);

            if (lista.length === 0) {
                return res.status(400).json({
                    mensagem: 'Informe ao menos um ingrediente. Ex: ingredientes=ovo,farinha'
                });
            }

            if (lista.length > 10) {
                return res.status(400).json({
                    mensagem: 'Informe no máximo 10 ingredientes por consulta.'
                });
            }

            if (lista.some(i => i.length > 100)) {
                return res.status(400).json({
                    mensagem: 'Cada ingrediente pode ter no máximo 100 caracteres.'
                });
            }

            // Uma condição EXISTS por ingrediente informado
            const existe = lista.map(item => {
                valores.push(`%${escaparLike(item)}%`);
                return `EXISTS (
                    SELECT 1
                    FROM receita_ingredientes ri
                    JOIN ingredientes i ON i.id = ri.ingrediente_id
                    WHERE ri.receita_id = r.id
                      AND i.nome ILIKE $${valores.length}
                )`;
            });

            const unir = modo === 'todos' ? ' AND ' : ' OR ';
            condicoes.push(`(${existe.join(unir)})`);
        }

        const resultado = await pool.query(
            `${SELECT_RECEITAS}
             WHERE ${condicoes.join(' AND ')}
             ORDER BY r.nome`,
            valores
        );

        res.json(resultado.rows);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: 'Erro ao filtrar receitas!'
        });
    }
});

module.exports = router;