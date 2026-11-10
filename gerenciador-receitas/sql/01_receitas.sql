-- Tabela de receitas (criada pela Pessoa 1)
-- Rode este arquivo ANTES do 02_categorias_ingredientes.sql

CREATE TABLE IF NOT EXISTS receitas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    tempo_preparo INTEGER NOT NULL,
    porcoes INTEGER NOT NULL,
    ingredientes JSONB NOT NULL,
    modo_preparo TEXT NOT NULL
);