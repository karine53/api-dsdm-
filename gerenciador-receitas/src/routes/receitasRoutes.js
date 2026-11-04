const express = require('express');
const router = express.Router();

const receitas = require('../data/receitas');

// Listar todas as receitas
router.get('/', (req, res) => {
    res.json(receitas);
});

module.exports = router;