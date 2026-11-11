# 🍽️  1.Gerenciador de Receitas Culinárias

API REST desenvolvida com Node.js, Express e PostgreSQL para o gerenciamento de receitas culinárias. O sistema permite cadastrar, consultar, atualizar e excluir receitas, além de listar categorias e pesquisar receitas por nome, categoria e ingredientes.


## 2. Funcionalidades

O projeto possui as seguintes funcionalidades:

### Gerenciamento de receitas
- Cadastrar novas receitas.
- Listar todas as receitas.
- Consultar uma receita pelo ID.
- Atualizar receitas cadastradas.
- Excluir receitas.

### Categorias
- Criar e armazenar categorias no banco de dados.
- Listar as categorias cadastradas.
- Consultar a quantidade de receitas associadas a cada categoria.

### Pesquisa e filtros
- Buscar receitas pelo nome.
- Filtrar receitas pelo ID ou nome da categoria.
- Pesquisar receitas pelos ingredientes.
- Combinar filtros de categoria e ingredientes.
- Escolher entre receitas que contenham todos os ingredientes informados ou qualquer um deles.
- Validar os parâmetros enviados nas consultas.

## 3. Pré-requisitos

Antes de executar o projeto, é necessário ter instalado no computador:

1. **Node.js e npm:** [https://nodejs.org/](https://nodejs.org/)
2. **PostgreSQL:** [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
3. **pgAdmin 4:** [https://www.pgadmin.org/download/](https://www.pgadmin.org/download/)
4. **Visual Studio Code:** [https://code.visualstudio.com/](https://code.visualstudio.com/)
5. **Postman:** [https://www.postman.com/downloads/](https://www.postman.com/downloads/)

O PostgreSQL deve estar instalado e em execução para que a API consiga acessar o banco de dados.

## 4. Como baixar o projeto

Faça o download do projeto ou clone o repositório do GitHub.

Caso utilize o Git, abra o terminal e execute:

```bash
git clone URL_DO_REPOSITORIO
```

Entre na pasta do projeto:

```bash
cd gerenciador-receitas
```

Abra a pasta no Visual Studio Code.

## 5. Instalação das dependências

No terminal do Visual Studio Code, execute:

```bash
npm install
```

Esse comando instala as dependências declaradas no arquivo `package.json`.

Caso o projeto ainda não tenha as dependências registradas, instale as bibliotecas utilizadas pela API:

```bash
npm install express pg dotenv
```

## 6. Configuração do banco de dados

O projeto utiliza o PostgreSQL para armazenar as informações das receitas, categorias e ingredientes.

### 6.1. Criar o banco de dados

1. Abra o pgAdmin 4.
2. Conecte-se ao servidor PostgreSQL.
3. Clique com o botão direito em **Databases**.
4. Selecione **Create → Database**.
5. Escolha um nome para o banco, por exemplo:

```text
gerenciador_receitas
```

6. Clique em **Save**.

### 6.2. Criar as tabelas

Dentro da pasta `sql`, existem arquivos responsáveis pela criação da estrutura do banco de dados.

Os arquivos devem ser executados na seguinte ordem:

**Primeiro: `01_receitas.sql`**

Esse arquivo cria a tabela `receitas`, contendo os seguintes campos:

- `id`: identificador da receita.
- `nome`: nome da receita.
- `categoria`: categoria da receita.
- `tempo_preparo`: tempo necessário para o preparo.
- `porcoes`: quantidade de porções.
- `ingredientes`: ingredientes armazenados em formato JSONB.
- `modo_preparo`: descrição do modo de preparo.

**Segundo: `02_categorias_ingredientes.sql`**

Esse arquivo cria e configura:

- A tabela `categorias`.
- A tabela `ingredientes`.
- A tabela intermediária `receita_ingredientes`.
- Os relacionamentos entre as tabelas.
- Os índices utilizados para auxiliar nas consultas.
- Os registros iniciais de categorias e ingredientes.
- A associação das receitas existentes às categorias correspondentes.

### Como executar os arquivos SQL

Para cada arquivo:

1. No pgAdmin, selecione o banco de dados criado.
2. Abra o **Query Tool**.
3. Abra o arquivo SQL correspondente.
4. Execute o conteúdo clicando no botão de execução (ícone de raio) ou pressionando F5.
5. Aguarde a confirmação da execução.

É importante executar o primeiro arquivo antes do segundo, pois o segundo utiliza a tabela `receitas`.

## 7. Configuração do arquivo .env

A API utiliza um arquivo `.env` para armazenar os dados necessários para a conexão com o PostgreSQL.

Na pasta principal do projeto, crie um arquivo chamado:

```text
.env
```

Preencha com as informações do PostgreSQL instalado no computador:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gerenciador_receitas
DB_USER=postgres
DB_PASSWORD=sua_senha_do_postgresql
```

**Atenção:**

- `DB_HOST`: endereço do servidor PostgreSQL.
- `DB_PORT`: porta utilizada pelo PostgreSQL, normalmente 5432.
- `DB_NAME`: nome do banco de dados criado.
- `DB_USER`: usuário do PostgreSQL.
- `DB_PASSWORD`: senha definida para esse usuário.

Cada pessoa que executar o projeto deverá configurar seu próprio arquivo `.env`, utilizando as credenciais do PostgreSQL instalado em seu computador.

Por segurança, o arquivo `.env` não deve ser compartilhado publicamente nem enviado ao GitHub.

O arquivo `.env.example` pode ser disponibilizado no projeto como modelo, sem conter senhas reais.

## 8. Executando a API

Depois de instalar as dependências, criar o banco e configurar o `.env`, abra o terminal na pasta principal do projeto.

Execute:

```bash
node src/server.js
```

Se tudo estiver configurado corretamente, aparecerão mensagens semelhantes a:

```text
Servidor rodando na porta 3000
Banco de dados conectado com sucesso!
```

A API estará disponível em:

```text
http://localhost:3000
```

Para verificar se está funcionando, acesse o endereço no navegador ou envie uma requisição GET pelo Postman:

```text
http://localhost:3000/
```

Resposta esperada:

```json
{
  "mensagem": "API de Receitas Culinárias funcionando!"
}
```

**Importante:** mantenha o terminal aberto enquanto estiver utilizando a API. Para encerrá-la, pressione `Ctrl + C`.

## 9. Endpoints da API

As requisições podem ser realizadas utilizando o Postman ou outra ferramenta capaz de enviar requisições HTTP.

A API utiliza os seguintes endpoints:

### 9.1. Gerenciamento de receitas

| Método | Rota | Descrição |
|---|---|---|
| GET | `/receitas` | Lista todas as receitas. |
| GET | `/receitas/:id` | Busca uma receita pelo ID. |
| POST | `/receitas` | Cadastra uma nova receita. |
| PUT | `/receitas/:id` | Atualiza uma receita existente. |
| DELETE | `/receitas/:id` | Exclui uma receita. |

### 9.2. Categorias

| Método | Rota | Descrição |
|---|---|---|
| GET | `/categorias` | Lista as categorias e a quantidade de receitas associadas. |

Exemplo:

```http
GET http://localhost:3000/categorias
```

### 9.3. Pesquisa de receitas

| Método | Rota | Descrição |
|---|---|---|
| GET | `/receitas/buscar?nome=bolo` | Busca receitas pelo nome. |

O parâmetro `nome` é obrigatório e deve possuir entre 2 e 100 caracteres.

Exemplo:

```http
GET http://localhost:3000/receitas/buscar?nome=bolo
```

A pesquisa não diferencia letras maiúsculas e minúsculas.

### 9.4. Filtros de receitas

| Método | Rota | Descrição |
|---|---|---|
| GET | `/receitas/filtrar?categoria=1` | Filtra pelo ID da categoria. |
| GET | `/receitas/filtrar?categoria=Sobremesa` | Filtra pelo nome da categoria. |
| GET | `/receitas/filtrar?ingredientes=ovo` | Filtra por ingrediente. |
| GET | `/receitas/filtrar?ingredientes=ovo,farinha` | Filtra por vários ingredientes. |

Também é possível combinar os filtros.

**Exemplo com todos os ingredientes:**

```http
GET http://localhost:3000/receitas/filtrar?ingredientes=ovo,farinha&modo=todos
```

**Exemplo aceitando qualquer ingrediente:**

```http
GET http://localhost:3000/receitas/filtrar?ingredientes=ovo,farinha&modo=qualquer
```

**Exemplo combinando categoria e ingrediente:**

```http
GET http://localhost:3000/receitas/filtrar?categoria=Sobremesa&ingredientes=ovo
```

### Parâmetros dos filtros

| Parâmetro | Obrigatório? | Descrição |
|---|---|---|
| `categoria` | Não | Recebe o ID ou o nome da categoria. |
| `ingredientes` | Não | Recebe até 10 ingredientes separados por vírgula. |
| `modo` | Não | Define se a receita deve possuir todos os ingredientes ou qualquer um deles. |

O parâmetro `modo` aceita dois valores:

- `todos`: a receita precisa conter todos os ingredientes informados.
- `qualquer`: a receita precisa conter pelo menos um dos ingredientes informados.

Quando o parâmetro `modo` não é informado, o padrão utilizado é `todos`.

É necessário informar pelo menos um dos filtros: `categoria` ou `ingredientes`.

## 10. Cadastro de receitas

Para cadastrar uma receita pelo Postman, utilize:

**Método:** POST

**Endereço:**

```text
http://localhost:3000/receitas
```

Na aba **Body**, selecione **raw** e escolha **JSON**.

Exemplo de corpo da requisição:

```json
{
    "nome": "Bolo de cenoura",
    "categoria": "Sobremesa",
    "tempoPreparo": 40,
    "porcoes": 8,
    "ingredientes": [
        "Cenoura",
        "Ovo",
        "Açúcar",
        "Farinha de trigo"
    ],
    "modoPreparo": "Bata os ingredientes, coloque em uma forma e leve ao forno."
}
```

Se os dados forem válidos, a API deverá retornar:

```text
201 Created
```

A resposta incluirá uma mensagem de confirmação e os dados da receita cadastrada.

## 11. Testando a API com o Postman

O Postman permite verificar se as rotas estão funcionando corretamente.

Para realizar os testes:

1. Abra o Postman.
2. Crie uma nova requisição HTTP.
3. Escolha o método desejado (GET, POST, PUT ou DELETE).
4. Informe o endereço da rota.
5. Quando necessário, configure o corpo da requisição na aba Body.
6. Clique em **Send**.
7. Confira o código de resposta e o conteúdo retornado.

### Códigos de resposta HTTP

| Código | Significado |
|---|---|
| 200 OK | Requisição realizada com sucesso. |
| 201 Created | Registro cadastrado com sucesso. |
| 400 Bad Request | Dados ou parâmetros inválidos. |
| 404 Not Found | Registro não encontrado. |
| 500 Internal Server Error | Erro interno no servidor. |

### Exemplos de testes

**Listar categorias:**

```text
GET http://localhost:3000/categorias
```

**Buscar receita pelo nome:**

```text
GET http://localhost:3000/receitas/buscar?nome=bolo
```

**Filtrar por categoria:**

```text
GET http://localhost:3000/receitas/filtrar?categoria=Sobremesa
```

**Filtrar por ingredientes:**

```text
GET http://localhost:3000/receitas/filtrar?ingredientes=ovo,farinha
```

**Testar validação sem informar filtros:**

```text
GET http://localhost:3000/receitas/filtrar
```

Nesse último caso, a resposta esperada é `400 Bad Request`, pois é necessário informar pelo menos um filtro.

## 12. Estrutura do projeto

A organização dos arquivos segue a seguinte estrutura:

```text
gerenciador-receitas/
│
├── src/
│   ├── config/
│   │   └── database.js
│   │
│   ├── routes/
│   │   ├── receitasRoutes.js
│   │   ├── categoriasRoutes.js
│   │   └── buscaRoutes.js
│   │
│   └── server.js
│
├── sql/
│   ├── 01_receitas.sql
│   └── 02_categorias_ingredientes.sql
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

**Descrição das principais pastas e arquivos:**

- `src/config/database.js`: configura a conexão entre a API e o PostgreSQL.
- `src/routes/receitasRoutes.js`: contém as rotas de cadastro, consulta, atualização e exclusão de receitas.
- `src/routes/categoriasRoutes.js`: contém a rota de listagem das categorias.
- `src/routes/buscaRoutes.js`: contém as rotas de pesquisa e filtros de receitas.
- `src/server.js`: configura e inicia o servidor Express.
- `sql/`: armazena os scripts utilizados para criar e configurar as tabelas do banco.
- `.env`: contém as configurações de conexão com o banco de dados.
- `.env.example`: apresenta um modelo de configuração sem credenciais reais.
- `.gitignore`: define os arquivos que não devem ser enviados ao repositório.
- `package.json`: apresenta as informações e dependências do projeto.
- `README.md`: contém as instruções de instalação e utilização.

## 13. Solução de problemas

### Erro de conexão com o PostgreSQL

Verifique:

- Se o PostgreSQL está em execução.
- Se o endereço e a porta estão corretos.
- Se o nome do banco de dados está correto.
- Se o usuário e a senha do `.env` estão corretos.
- Se o banco foi criado e os scripts SQL foram executados.

### Erro ao executar a API

Confira se as dependências foram instaladas:

```bash
npm install
```

Verifique também se o arquivo `src/server.js` está sendo executado a partir da pasta principal do projeto.

### Erro 404

Verifique se o endereço da requisição está correto e se a rota existe no servidor.

### Erro 400

Confira os parâmetros informados na URL e os dados enviados no corpo da requisição.

### Erro 500

Verifique o terminal do VS Code para identificar a mensagem de erro gerada pelo servidor. Também confira se as tabelas e colunas utilizadas pela consulta existem no banco de dados.

## 14. Considerações finais

O Gerenciador de Receitas Culinárias foi desenvolvido com o objetivo de facilitar o armazenamento, a consulta e a organização de receitas.

A API utiliza operações HTTP para permitir a comunicação com o banco de dados PostgreSQL, possibilitando o gerenciamento das informações e a realização de pesquisas por nome, categoria e ingredientes.

A documentação apresenta os requisitos e procedimentos necessários para instalar, configurar, executar e testar o projeto em outro computador.