# Teste Técnico Back-end da BeTalent

## Descrição do Projeto

Este projeto consiste em estruturar uma API RESTful conectada a um banco de dados para gerenciar usuários, clientes, produtos e vendas. O sistema permite que usuários externos se cadastrem, façam login e, após autenticados, possam registrar e gerenciar clientes, produtos e vendas.

## Tecnologias Utilizadas

- **Framework**: AdonisJS (Node.js)
- **Banco de Dados**: MySQL
- **Autenticação**: JWT (JSON Web Token)

## Estrutura do Banco de Dados

O banco de dados está estruturado com as seguintes tabelas e relacionamentos:

![banco de dados](./docs/clientDB.png)

## Relacionamentos

- **Clientes - Endereços**: Um cliente pode ter múltiplos endereços (Relacionamento 1:N).
- **Clientes - Telefones**: Um cliente pode ter múltiplos telefones (Relacionamento 1:N).
- **Clientes - Vendas**: Um cliente pode ter múltiplas vendas (Relacionamento 1:N).
- **Produtos - Vendas**: Um produto pode estar presente em múltiplas vendas (Relacionamento 1:N).

## Instalação e Configuração

Antes de criar um novo aplicativo, você deve garantir que tem Node.js e npm instalados no seu computador. O AdonisJS precisa de Node.js >= 20.6.

Você pode instalar o Node.js usando os instaladores oficiais ou o [Volta](https://volta.sh). O Volta é um gerenciador de pacotes multiplataforma que instala e executa várias versões do Node.js no seu computador.

### Verificar versão do Node.js

Para garantir que você está usando a versão correta do Node.js, execute o seguinte comando:

```sh
node -v
# v22.0.0
```
### Passos para Instalação

1. Clone o repositório:

    ```bash
    git clone git@github.com:Queonias/Teste-Tecnico-Back-end-da-BeTalent.git
    cd Teste-Tecnico-Back-end-da-BeTalent
    ```

2. Instale as dependências:

    ```bash
    npm install
    ```

3. Configure o banco de dados no arquivo `.env`:

    Copie o arquivo `.env.example` para `.env` e complete as variáveis de ambiente conforme necessário. O arquivo `.env.example` contém os seguintes exemplos de configuração:

    ```env
    TZ=UTC
    PORT=3333
    HOST=localhost
    LOG_LEVEL=info
    APP_KEY=rpOUjXIU8KRELwoJcTi3DWoKJro0-KTB
    NODE_ENV=development
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_USER=root
    DB_PASSWORD=               # Complete com sua senha do MySQL
    DB_DATABASE=                # Complete com o nome do seu banco de dados
    ```

    Use o arquivo `.env.example` como referência para configurar o seu arquivo `.env`.

4. Execute as migrações:

    ```bash
    node ace migration:run
    ```

5. Inicie o servidor:

    ```bash
    npm start
    ```

## Rotas do Sistema

### Autenticação

#### Cadastro de Usuário

- **POST /api/users/signup**

**Body da Requisição:**

  ```json
    {
      "email": "usuario@example.com",
      "password": "senha123"
    }
  ```

#### Login de Usuário

- **POST /api/users/login**

**Body da Requisição:**

  ```json
    {
      "email": "usuario@example.com",
      "password": "senha123"
    }
  ```
**Exemplo de Resposta:**

```json
{
  "token": {
    "type": "bearer",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcyMjgzMTM4OX0.HlIHfPXLNwbYP6jTELgZtFPQ0-UaQkv0T40Ihj1jPDc"
  }
}
```

**Instruções de Uso:**
Após receber o token JWT, você deve incluí-lo no cabeçalho Authorization das requisições para acessar as rotas protegidas:
```
Authorization: Bearer {seu_token_aqui}
```



### Clientes (Protegidas por autenticação)

#### Listar Todos os Clientes

- **GET /api/clients/list**

**Exemplo de Resposta:**

  ```json
    [
      {
        "id": 1,
        "name": "Cliente 1",
        "cpf": "123.456.789-00"
      },
      {
        "id": 2,
        "name": "Cliente 2",
        "cpf": "987.654.321-00"
      }
    ]
  ```

#### Detalhar um Cliente e Suas Vendas

- **GET /api/clients/:id?month=MM&year=YYYY**

- ##### Parâmetros da URL

- `:id` é o ID do cliente que você deseja detalhar.
- `month` é o mês pelo qual você deseja filtrar as vendas (opcional).
- `year` é o ano pelo qual você deseja filtrar as vendas (opcional).

**Exemplo de Resposta:**

  ```json
    {
       "id": 6,
        "name": "Cliente 1",
        "cpf": "123.456.789-00",
        "addresses": [
          {
            "id": 1,
            "clientId": 6,
            "street": "Rua A",
            "number": "123",
            "complement": null,
            "neighborhood": "Bairro B",
            "city": "Cidade C",
            "state": "Estado D",
            "cep": "12345-678"
           }
        ],
        "phones": [
          {
            "id": 1,
            "clientId": 6,
            "number": "(11) 98765-4321"
          }
        ],
        "sales": [
          {
            "id": 1,
            "product_id": 1,
            "quantity": 2,
            "unit_price": 100.00,
            "total_price": 200.00,
            "sale_date": "2024-01-01T00:00:00.000Z"
          }
        ]
      }
  ```

#### Adicionar um Novo Cliente

- **POST /api/clients/save**

**Body da Requisição:**

 ```json
    {
      "name": "Cliente 1",
      "cpf": "123.456.789-00",
      "addresses": [
        {
          "street": "Rua A",
          "number": "123",
          "complement": "Apto 1",
          "neighborhood": "Bairro B",
          "city": "Cidade C",
          "state": "Estado D",
          "cep": "12345-678"
        }
      ],
      "phones": [
        {
          "number": "(11) 98765-4321"
        }
      ]
    }
 ```

**Exemplo de Resposta:**
 ```json
{
  "name": "Cliente 1",
  "cpf": "123.456.789-00",
  "id": 1
}
 ```


#### Editar um Cliente

- **PUT /api/clients/:id**

**Body da Requisição:**

  ```json
    {
      "name": "Cliente Atualizado",
      "cpf": "123.456.789-00",
      "addresses": [
        {
          "id": 1,
          "street": "Rua Nova",
          "number": "321",
          "complement": "Apto 2",
          "neighborhood": "Bairro Novo",
          "city": "Cidade Nova",
          "state": "Estado Novo",
          "cep": "87654-321"
        }
      ],
      "phones": [
        {
          "id": 1,
          "number": "(11) 12345-6789"
        }
      ]
    }
  ```

#### Excluir um Cliente e Suas Vendas

- **DELETE /api/clients/:id**

**Exemplo de Resposta:**

  ```json
    {
      "message": "Clientes e vendas relacionadas, endereços e telefones excluídos com sucesso"
    }
  ```

### Produtos (Protegidas por autenticação)

#### Listar Todos os Produtos

- **GET /api/products/list**

**Exemplo de Resposta:**

  ```json
    [
      {
        "id": 1,
        "name": "Produto 1",
        "price": 100.00
      },
      {
        "id": 2,
        "name": "Produto 2",
        "price": 200.00
      }
    ]
  ```

#### Detalhar um Produto

- **GET /api/products/:id**

**Exemplo de Resposta:**

  ```json
    {
      "id": 1,
      "name": "Produto 1",
      "description": "Descrição do Produto 1",
      "price": 100.00,
      "is_deleted": false
    }
  ```

#### Adicionar um Novo Produto

- **POST /api/products/save**

**Body da Requisição:**

  ```json
    {
      "id": 1
      "name": "Produto 1",
      "description": "Descrição do Produto 1",
      "price": 100.00
    }
  ```

#### Editar um Produto

- **PUT /api/products/:id**

**Body da Requisição:**

  ```json
    {
      "name": "Produto Atualizado",
      "description": "Descrição Atualizada",
      "price": 150.00
    }
  ```

#### Exclusão Lógica de um Produto

- **DELETE /api/products/:id**

**Exemplo de Resposta:**

  ```json
    {
      "message": "Produto excluído com sucesso"
    }
  ```

### Vendas (Protegidas por autenticação)

#### Registrar uma Venda

- **POST /api/sales/save**

**Body da Requisição:**

  ```json
    {
      "clientId": 7,
      "productId": 3,
      "quantity": 2
    }
  ```

## Middleware de Autenticação

As rotas de clientes, produtos e vendas são protegidas por middleware de autenticação. Apenas usuários autenticados podem acessar essas rotas.