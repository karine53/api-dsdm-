const express = require('express');

const app = express();

app.use(express.json());

// Rota inicial
app.get('/', (req, res) => {
    res.json({
        mensagem: 'API de Receitas Culinárias funcionando!'
    });
});

// Iniciar servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});