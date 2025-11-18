# Backend - NexusPDV (API)

Este é o backend do **NexusPDV**, um Sistema de Gestão de Estoque e Caixa (PDV), desenvolvido em **Java 21** com **Spring Boot 3**.

## 1. Dependências Principais

O projeto utiliza as seguintes dependências principais do ecossistema Spring e Java:

* **Spring Web:** Para a criação de controladores RESTful.
* **Spring Data JPA:** Para persistência de dados e abstração de repositórios.
* **Spring Validation:** Para validação robusta de dados de entrada (DTOs).
* **H2 Database (In-Memory):** Banco de dados SQL em memória para desenvolvimento ágil (os dados são reiniciados a cada execução).
* **Springdoc OpenAPI (Swagger UI):** Para documentação automática e interativa da API.
* **Lombok:** Para redução de código boilerplate (Getters, Setters, Construtores).

## 2. Portas e Caminhos Utilizados

* **Porta da Aplicação:** `http://localhost:8080`
* **Console H2 (Banco de Dados):** `http://localhost:8080/h2-console`
    * **JDBC URL:** `jdbc:h2:mem:syspdvdb`
    * **Usuário:** `sa`
    * **Senha:** (deixe em branco)
* **Documentação Swagger UI:** `http://localhost:8080/swagger-ui.html`
* **Documentação OpenAPI (JSON):** `http://localhost:8080/api-docs`

## 3. Perfis de Acesso e Dados Iniciais

Ao iniciar a aplicação, o sistema verifica e cria automaticamente dois usuários padrão para testes (definidos em `SyspdvBackendApplication.java`):

| Perfil | E-mail | Senha | Permissões |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@syspdv.com` | `Admin123` | Acesso total (Dashboard, Usuários, Estoque, Relatórios) |
| **Operador** | `operador@syspdv.com` | `Operador123` | Acesso focado em vendas (Caixa/PDV, Relatórios Pessoais) |

## 4. Passos para Execução

### Opção 1: Via Maven (Terminal)

1.  Abra um terminal na raiz do projeto backend.
2.  Execute o comando para limpar e rodar a aplicação:
    ```bash
    mvn spring-boot:run
    ```

### Opção 2: Via IDE (IntelliJ / Eclipse / VS Code)

1.  Importe o projeto como um projeto Maven.
2.  Localize a classe principal: `src/main/java/com/fatesg/syspdv_backend/SyspdvBackendApplication.java`.
3.  Execute o método `main()` (Run/Debug).

A aplicação estará disponível em `http://localhost:8080`.

## 5. Endpoints da API

Abaixo estão os principais endpoints expostos pela API. Para a lista completa e testes, utilize o **Swagger UI**.

### 🔐 Autenticação (`/api/auth`)

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Autentica o usuário e retorna um token de sessão. |
| `POST` | `/api/auth/logout` | Realiza o logout do usuário. |
| `GET` | `/api/auth/validar-token` | Valida se um token de sessão ainda é válido. |

### 📦 Produtos e Estoque (`/api/produtos`)

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/produtos` | Lista todos os produtos cadastrados. |
| `GET` | `/api/produtos/codigo/{codigo}` | Busca um produto pelo código de barras/sku. |
| `POST` | `/api/produtos` | Cria um novo produto (Admin). |
| `POST` | `/api/produtos/baixar-estoque` | Registra uma saída de estoque (venda/perda). |
| `POST` | `/api/produtos/repor-estoque` | Registra uma entrada de estoque (compra). |
| `POST` | `/api/produtos/ajustar-estoque` | Realiza ajuste de inventário (correção). |
| `GET` | `/api/produtos/{id}/historico` | Retorna o histórico de movimentações do produto. |

### 🛒 Vendas (`/api/vendas`)

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `POST` | `/api/vendas` | Registra uma nova venda (baixa estoque automaticamente). |
| `GET` | `/api/vendas` | Lista vendas (suporta filtros por data e usuário). |
| `GET` | `/api/vendas/{id}` | Detalhes completos de uma venda específica. |

### 👥 Usuários (`/api/usuarios`)

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/usuarios` | Lista todos os usuários. |
| `POST` | `/api/usuarios` | Cadastra um novo usuário. |
| `PUT` | `/api/usuarios/{id}` | Atualiza dados de um usuário. |
| `DELETE` | `/api/usuarios/{id}` | Remove um usuário. |