# Documentação dos endpoints — Categorias, Buscas e Filtros

Base URL: `http://localhost:3000`

Antes de usar, rode o script `sql/02_categorias_ingredientes.sql` no banco.

---

## GET /categorias
Lista todas as categorias com a quantidade de receitas de cada uma.

**Resposta 200**
json
[
  { "id": 2, "nome": "Almoço", "total_receitas": 1 },
  { "id": 4, "nome": "Sobremesa", "total_receitas": 1 }
]
```

---

## GET /receitas/buscar?nome=bolo
Busca receitas pelo nome (parcial, sem diferenciar maiúsculas/minúsculas).

| Parâmetro | Obrigatório | Regra |
|-----------|-------------|-------|
| `nome`    | Sim         | texto de 2 a 100 caracteres |

**Resposta 200** — lista de receitas (`[]` se nada for encontrado). Cada item traz também `categoria_nome`.

**Erros 400**
- `nome` ausente, com menos de 2 ou mais de 100 caracteres
- qualquer outro parâmetro na URL

---

## GET /receitas/filtrar
Filtra receitas por categoria e/ou ingredientes. Pelo menos um filtro é obrigatório; se enviar os dois, os dois precisam ser atendidos.

| Parâmetro      | Obrigatório | Regra |
|----------------|-------------|-------|
| `categoria`    | Não*        | **id** (ex.: `2`) ou **nome** (ex.: `Almoço`), até 50 caracteres |
| `ingredientes` | Não*        | lista separada por vírgula, de 1 a 10 itens (ex.: `ovo,farinha`) |
| `modo`         | Não         | `todos` (padrão: a receita precisa ter **todos** os ingredientes) ou `qualquer` (**pelo menos um**) |

\* informe ao menos um entre `categoria` e `ingredientes`.

**Exemplos**
```
/receitas/filtrar?categoria=Sobremesa
/receitas/filtrar?categoria=2
/receitas/filtrar?ingredientes=ovo,farinha
/receitas/filtrar?ingredientes=cenoura,frango&modo=qualquer
/receitas/filtrar?categoria=Almoço&ingredientes=ovo
```

**Resposta 200** — lista de receitas (`[]` se nada for encontrado).

**Erros 400**
- nenhum filtro informado
- `categoria` vazia, ID inválido ou nome longo demais
- `ingredientes` vazio (`,,`), repetido na URL, com mais de 10 itens ou itens com mais de 100 caracteres
- `modo` diferente de `todos`/`qualquer`
- parâmetro desconhecido

---

## Formato dos erros
```json
{ "mensagem": "Descrição do problema" }
```
Erros inesperados do servidor retornam **500**.