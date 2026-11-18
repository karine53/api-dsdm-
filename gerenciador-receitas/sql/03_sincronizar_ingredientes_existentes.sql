-- Sincroniza as receitas já cadastradas com as tabelas relacionais usadas
-- pela rota /receitas/filtrar. Seguro para executar mais de uma vez.

-- Cria na tabela ingredientes os nomes que já estão no JSONB das receitas.
INSERT INTO ingredientes (nome)
SELECT DISTINCT TRIM(item.nome)
FROM receitas r
CROSS JOIN LATERAL jsonb_array_elements_text(
    CASE
        WHEN jsonb_typeof(r.ingredientes) = 'array' THEN r.ingredientes
        ELSE '[]'::jsonb
    END
) AS item(nome)
WHERE TRIM(item.nome) <> ''
  AND NOT EXISTS (
      SELECT 1 FROM ingredientes i
      WHERE LOWER(i.nome) = LOWER(TRIM(item.nome))
  )
ON CONFLICT (nome) DO NOTHING;

-- Cria as relações receita/ingrediente correspondentes.
INSERT INTO receita_ingredientes (receita_id, ingrediente_id)
SELECT DISTINCT r.id, i.id
FROM receitas r
CROSS JOIN LATERAL jsonb_array_elements_text(
    CASE
        WHEN jsonb_typeof(r.ingredientes) = 'array' THEN r.ingredientes
        ELSE '[]'::jsonb
    END
) AS item(nome)
JOIN ingredientes i ON LOWER(i.nome) = LOWER(TRIM(item.nome))
WHERE TRIM(item.nome) <> ''
ON CONFLICT (receita_id, ingrediente_id) DO NOTHING;

-- Conferência: deve mostrar quantos ingredientes relacionais cada receita tem.
SELECT r.id, r.nome, COUNT(ri.ingrediente_id) AS total_ingredientes
FROM receitas r
LEFT JOIN receita_ingredientes ri ON ri.receita_id = r.id
GROUP BY r.id, r.nome
ORDER BY r.id;
