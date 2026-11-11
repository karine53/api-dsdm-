CREATE TABLE IF NOT EXISTS categorias (
    id   SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS ingredientes (
    id   SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);

ALTER TABLE receitas
    ADD COLUMN IF NOT EXISTS categoria_id INTEGER REFERENCES categorias(id);

CREATE TABLE IF NOT EXISTS receita_ingredientes (
    receita_id     INTEGER NOT NULL REFERENCES receitas(id)     ON DELETE CASCADE,
    ingrediente_id INTEGER NOT NULL REFERENCES ingredientes(id) ON DELETE CASCADE,
    quantidade     VARCHAR(50),
    PRIMARY KEY (receita_id, ingrediente_id)
);

CREATE INDEX IF NOT EXISTS idx_receitas_categoria_id ON receitas(categoria_id);
CREATE INDEX IF NOT EXISTS idx_receita_ing_ingrediente ON receita_ingredientes(ingrediente_id);

INSERT INTO categorias (nome) VALUES
    ('Café da manhã'), ('Almoço'), ('Jantar'),
    ('Sobremesa'), ('Lanche'), ('Bebida')
ON CONFLICT (nome) DO NOTHING;

INSERT INTO categorias (nome)
SELECT DISTINCT TRIM(categoria) FROM receitas
WHERE categoria IS NOT NULL AND TRIM(categoria) <> ''
ON CONFLICT (nome) DO NOTHING;

UPDATE receitas r
SET categoria_id = c.id
FROM categorias c
WHERE LOWER(c.nome) = LOWER(TRIM(r.categoria))
  AND r.categoria_id IS NULL;

INSERT INTO ingredientes (nome) VALUES
    ('Cenoura'), ('Ovo'), ('Açúcar'), ('Farinha de trigo'), ('Fermento'),
    ('Leite'), ('Frango'), ('Molho de tomate'), ('Sal'), ('Manteiga')
ON CONFLICT (nome) DO NOTHING;