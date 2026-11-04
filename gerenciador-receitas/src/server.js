const express = require('express');

const app = express();

app.use(express.json());

const receitasRoutes = require('./routes/receitasRoutes');

app.get('/', (req, res) => {
    res.json({
        mensagem: 'API de Receitas Culinárias funcionando!'
    });
});

app.use('/receitas', receitasRoutes);

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});