# DOCUMENTAÇÃO DOS ENDPOINTS
## Gerenciador de Receitas Culinárias

Esta documentação apresenta as rotas desenvolvidas para o gerenciamento de categorias, pesquisa de receitas e filtros por categoria e ingredientes.

### 1. Listar categorias

**Método:** GET

**Rota:** `/categorias`

**Descrição:** Retorna todas as categorias cadastradas no banco de dados, juntamente com a quantidade de receitas associadas a cada categoria.

**Exemplo de requisição:**
```http
GET http://localhost:3000/categorias
```

**Resposta de sucesso (200 OK):**
```json
[
  {
    "id": 1,
    "nome": "Sobremesa",
    "total_receitas": 2
  }
]
```

### 2. Buscar receitas por nome

**Método:** GET

**Rota:** `/receitas/buscar`

**Descrição:** Permite pesquisar receitas pelo nome, retornando aquelas que contêm o texto informado. A pesquisa não diferencia letras maiúsculas e minúsculas.

**Parâmetro:**

- `nome` (obrigatório): texto utilizado na pesquisa. Deve possuir entre 2 e 100 caracteres.

**Exemplo de requisição:**
```http
GET http://localhost:3000/receitas/buscar?nome=bolo
```

**Resposta de sucesso:** Lista das receitas encontradas (200 OK).

**Possíveis erros:**
- `400 Bad Request`: parâmetro ausente, inválido ou fora do limite de caracteres.
- `500 Internal Server Error`: erro interno ao realizar a consulta.

### 3. Filtrar receitas por categoria e ingredientes

**Método:** GET

**Rota:** `/receitas/filtrar`

**Descrição:** Permite localizar receitas utilizando filtros de categoria e ingredientes. É possível utilizar apenas um filtro ou combinar os dois.

**Parâmetros disponíveis:**

- `categoria` (opcional): aceita o ID ou o nome de uma categoria.
- `ingredientes` (opcional): recebe um ou mais ingredientes separados por vírgula. São permitidos até 10 ingredientes, com no máximo 100 caracteres cada.
- `modo` (opcional): define como os ingredientes serão considerados. Aceita `todos` ou `qualquer`. O padrão é `todos`.

**Exemplos de requisição:**

Filtrar por ID da categoria:
```http
GET http://localhost:3000/receitas/filtrar?categoria=1
```

Filtrar por nome da categoria:
```http
GET http://localhost:3000/receitas/filtrar?categoria=Sobremesa
```

Filtrar por ingrediente:
```http
GET http://localhost:3000/receitas/filtrar?ingredientes=ovo
```

Filtrar por vários ingredientes, exigindo todos:
```http
GET http://localhost:3000/receitas/filtrar?ingredientes=ovo,farinha&modo=todos
```

Filtrar por vários ingredientes, aceitando qualquer um:
```http
GET http://localhost:3000/receitas/filtrar?ingredientes=ovo,farinha&modo=qualquer
```

Combinar categoria e ingrediente:
```http
GET http://localhost:3000/receitas/filtrar?categoria=Sobremesa&ingredientes=ovo
```

**Resposta de sucesso:** Lista das receitas que correspondem aos filtros informados (200 OK). Caso nenhuma receita seja encontrada, retorna uma lista vazia.

**Possíveis erros:**
- `400 Bad Request`: nenhum filtro informado, parâmetros inválidos, modo diferente de `todos` ou `qualquer`, ou quantidade de ingredientes acima do permitido.
- `500 Internal Server Error`: erro interno ao realizar a consulta.

### 4. Validação dos filtros

A API realiza validações para evitar consultas com parâmetros incorretos.

Entre as verificações estão:

- Obrigatoriedade do nome na pesquisa por receitas.
- Limite mínimo e máximo de caracteres no nome.
- Verificação dos parâmetros permitidos.
- Validação do ID ou nome da categoria.
- Limite de ingredientes por consulta.
- Verificação do modo de pesquisa dos ingredientes.
- Impedimento de filtros vazios ou inválidos.

Quando uma validação não é atendida, a API retorna o status `400 Bad Request`, acompanhado de uma mensagem explicativa.

### 5. Códigos de resposta HTTP

| Código | Significado |
|---|---|
| 200 | Requisição realizada com sucesso. |
| 400 | Parâmetros ou filtros inválidos. |
| 500 | Erro interno no servidor. |

**Observação:** As requisições devem ser realizadas com o servidor da API em execução na porta 3000.