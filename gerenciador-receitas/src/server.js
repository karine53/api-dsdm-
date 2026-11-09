const express = require('express');
const pool = require('./config/database');

const app = express();

app.use(express.json());

const receitasRoutes = require('./routes/receitasRoutes');

const categoriasRoutes = require('./routes/categoriasRoutes');
const buscaRoutes = require('./routes/buscaRoutes');

app.get('/', (req, res) => {
    res.json({
        mensagem: 'API de Receitas Culinárias funcionando!'
    });
});

app.use('/categorias', categoriasRoutes);

// buscaRoutes TEM que vir ANTES de receitasRoutes
app.use('/receitas', buscaRoutes);
app.use('/receitas', receitasRoutes);

// Testar conexão com o PostgreSQL
pool.query('SELECT NOW()')
    .then(() => {
        console.log('Banco de dados conectado com sucesso!');
    })
    .catch((erro) => {
        console.error('Erro ao conectar ao banco:', erro.message);
    });

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});