# 🏢 Sistema de Gestão Empresarial (DW3)

![Status do Projeto](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow?style=for-the-badge)
![Licença](https://img.shields.io/badge/Licença-MIT-blue?style=for-the-badge)

Uma aplicação Web **Full Stack** robusta desenvolvida para o gerenciamento corporativo de Funcionários, Cargos, Setores e Projetos. O sistema utiliza uma arquitetura separada com uma API RESTful no backend e uma interface moderna e responsiva no frontend.

---

## 📋 Índice

- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Configuração](#-instalação-e-configuração)
    - [1. Banco de Dados](#1-banco-de-dados-postgresql)
    - [2. Backend](#2-backend)
    - [3. Frontend](#3-frontend)
- [Credenciais de Acesso](#-credenciais-de-acesso)
- [Documentação da API](#-documentação-da-api)

---

## 🚀 Tecnologias Utilizadas

### Backend
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat-square)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=flat-square&logo=JSON%20web%20tokens)

* **[Node.js](https://nodejs.org/):** Ambiente de execução JavaScript.
* **[Express.js](https://expressjs.com/):** Framework web rápido e minimalista.
* **[PostgreSQL](https://www.postgresql.org/):** Banco de dados relacional robusto.
* **[JWT (JsonWebToken)](https://jwt.io/):** Padrão para autenticação segura.
* **[BcryptJS](https://www.npmjs.com/package/bcryptjs):** Hashing de senhas para segurança.

### Frontend
![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=flat-square&logo=vuedotjs&logoColor=4FC08D)
![Vuetify](https://img.shields.io/badge/Vuetify-1867C0?style=flat-square&logo=vuetify&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat-square&logo=vite&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)

* **[Vue.js 3](https://vuejs.org/):** Framework JavaScript progressivo (Composition API).
* **[Vite](https://vitejs.dev/):** Ferramenta de build de próxima geração.
* **[Vuetify 3](https://vuetifyjs.com/):** Framework de componentes Material Design.
* **[Vue Router](https://router.vuejs.org/):** Roteador oficial para Vue.js.

---

## 📂 Estrutura do Projeto

Abaixo está a organização das pastas principais do repositório:

```text
/
├── dw3backend/         # 🔙 Backend (API REST)
│   ├── apps/           # Módulos (Controllers, Models, Testes)
│   ├── database/       # Configuração do DB
│   ├── routes/         # Rotas da API
│   └── app.js          # Ponto de entrada do servidor
└── frontend/           # 🎨 Frontend (SPA)
    ├── src/
    │   ├── views/      # Páginas (Vue components)
    │   ├── services/   # Integração com API (Axios)
    │   └── router/     # Definição de rotas
```

---

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:
* [Node.js](https://nodejs.org/) (Versão 18 ou superior recomendada)
* [PostgreSQL](https://www.postgresql.org/)

---

## 🛠️ Instalação e Configuração

### 1. Banco de Dados (PostgreSQL)

Crie um banco de dados chamado `dw3` (ou altere no `.env` posteriormente). Execute o script SQL abaixo para criar as tabelas e o usuário administrador inicial.

<details>
<summary><strong>📄 Clique para expandir o Script SQL</strong></summary>

```sql
-- Criação das Tabelas
CREATE TABLE IF NOT EXISTS usuarios (
    username VARCHAR(50) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS setores (
    setorid SERIAL PRIMARY KEY,
    codigo VARCHAR(20),
    nome VARCHAR(100),
    andar INT,
    ativo BOOLEAN DEFAULT true,
    deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS cargos (
    cargoid SERIAL PRIMARY KEY,
    codigo VARCHAR(20),
    descricao VARCHAR(100),
    salario_base NUMERIC(10,2),
    ativo BOOLEAN DEFAULT true,
    deleted BOOLEAN DEFAULT false
);

-- Tabela Associativa Cargos <-> Setores
CREATE TABLE IF NOT EXISTS cargos_setores (
    cargoid INT REFERENCES cargos(cargoid),
    setorid INT REFERENCES setores(setorid),
    PRIMARY KEY (cargoid, setorid)
);

CREATE TABLE IF NOT EXISTS funcionarios (
    funcionarioid SERIAL PRIMARY KEY,
    matricula VARCHAR(20),
    nome VARCHAR(100),
    cpf VARCHAR(14),
    email VARCHAR(100),
    telefone VARCHAR(20),
    datanascimento DATE,
    dataadmissao DATE,
    salario NUMERIC(10,2),
    cargoid INT REFERENCES cargos(cargoid),
    setorid INT REFERENCES setores(setorid),
    deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS projetos (
    projetoid SERIAL PRIMARY KEY,
    codigo VARCHAR(20),
    nome VARCHAR(100),
    descricao TEXT,
    datainicio DATE,
    datafim DATE,
    status VARCHAR(30),
    orcamento NUMERIC(12,2),
    deleted BOOLEAN DEFAULT false
);

-- Tabela Associativa Funcionários <-> Projetos
CREATE TABLE IF NOT EXISTS funcionarios_projetos (
    funcionarioid INT REFERENCES funcionarios(funcionarioid),
    projetoid INT REFERENCES projetos(projetoid),
    dataatribuicao DATE,
    papel VARCHAR(50),
    horasalocadas INT,
    deleted BOOLEAN DEFAULT false,
    PRIMARY KEY (funcionarioid, projetoid)
);

-- Inserir Usuário Admin Padrão
-- Senha é 'admin' (hash gerado pelo bcrypt)
INSERT INTO usuarios (username, password) 
VALUES ('admin', '$2a$10$BitC/g.tVdO.jX/bB3.sV.uQz.p.s.m.l.j.k.g.f.d.s.a');
```
</details>

### 2. Backend

1.  Navegue até a pasta do servidor:
    ```bash
    cd dw3backend
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Crie um arquivo `.env` na raiz de `dw3backend` com as credenciais do seu banco:
    ```env
    # .env
    DB_USER=postgres
    DB_HOST=localhost
    DB_NAME=dw3
    DB_PASS=sua_senha
    DB_PORT=5432
    SECRET_API=suaChaveSecreta123
    ```

4.  Inicie o servidor:
    ```bash
    npm run dev
    # OU
    node app.js
    ```
    ✅ *O servidor rodará na porta **40000**.*

### 3. Frontend

1.  Navegue até a pasta da interface:
    ```bash
    cd frontend
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Execute o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

4.  Acesse a aplicação no navegador (geralmente em `http://localhost:5173`).

---

## 🔐 Credenciais de Acesso

Para realizar o login inicial, utilize o usuário criado pelo script SQL:

| Campo | Valor |
| :--- | :--- |
| **Usuário** | `admin` |
| **Senha** | `admin` |

---

## 📡 Documentação da API

O backend fornece os seguintes endpoints REST (base: `http://localhost:40000`).
> **Nota:** A maioria das operações de escrita (POST) requer autenticação via Bearer Token.

#### 🔐 Autenticação
* `POST /Login` - Autentica e retorna o token JWT.
* `POST /Logout` - Encerra a sessão.

#### 👥 Funcionários
* `GET /getAllFuncionarios`
* `POST /getFuncionarioByID`
* `POST /insertFuncionario`
* `POST /updateFuncionario`
* `POST /deleteFuncionario`

#### 👔 Cargos
* `GET /getAllCargos`
* `POST /getCargoByID`
* `POST /insertCargo`
* `POST /updateCargo`
* `POST /deleteCargo`

#### 🏢 Setores
* `GET /getAllSetores`
* `POST /getSetorByID`
* `POST /insertSetor`
* `POST /updateSetor`
* `POST /deleteSetor`

#### 🚀 Projetos
* `GET /getAllProjetos`
* `POST /getProjetoByID`
* `POST /insertProjeto`
* `POST /updateProjeto`
* `POST /deleteProjeto`

---
<div align="center">
  <sub>Desenvolvido para a disciplina de DW3.</sub>
</div>
```
