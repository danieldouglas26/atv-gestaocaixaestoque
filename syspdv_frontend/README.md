# Frontend - NexusPDV (Web)

Este é o frontend do **NexusPDV**, desenvolvido em **Angular 19** e estilizado com a biblioteca de componentes **PrimeNG**. A aplicação oferece uma interface moderna e responsiva para gestão administrativa e frente de caixa.

## 1. Tecnologias Principais

O projeto utiliza as seguintes tecnologias e bibliotecas:

* **Angular 19:** Framework principal, utilizando a abordagem de *Standalone Components*.
* **PrimeNG:** Biblioteca de componentes UI rica (Tabelas, Gráficos, Diálogos, Toasts).
* **PrimeFlex / CSS Grid:** Para layout responsivo e utilitários de CSS.
* **Angular HttpClient:** Para comunicação com a API REST.
* **Reactive Forms:** Para manipulação segura e validada de formulários complexos.
* **Guards (CanActivate):** Para proteção de rotas baseada em autenticação e perfis de usuário (`RoleGuard`).

## 2. Fluxo de Autenticação e Segurança

O sistema implementa controle de acesso via rotas protegidas:

1.  **Login:** O usuário insere credenciais na rota `/login`.
2.  **Sessão:** Se validado, um objeto de usuário e um token são salvos no `localStorage` via `AuthService`.
3.  **Redirecionamento Inteligente:**
    * **Admin:** Redirecionado para o Dashboard (`/app/dashboard`).
    * **Operador:** Redirecionado para a tela de Boas-vindas (`/app/welcome`).
4.  **Guards:**
    * `authGuard`: Impede acesso a qualquer rota interna `/app/*` se não houver sessão.
    * `roleGuard`: Restringe módulos específicos (ex: Operador não acessa "Manter Usuários").

## 3. Portas e Configuração

* **Porta do Frontend:** `http://localhost:4200`
* **API Backend:** Espera-se que o backend esteja rodando em `http://localhost:8080`.

## 4. Passos para Execução

1.  Certifique-se de que o **Backend** esteja em execução.
2.  Abra um terminal na raiz deste projeto frontend.
3.  Instale as dependências (caso seja a primeira vez):
    ```bash
    npm install
    ```
4.  Inicie o servidor de desenvolvimento:
    ```bash
    ng serve
    ```
5.  Acesse `http://localhost:4200` no navegador.

## 5. Funcionalidades por Módulo

### 🛡️ Módulo Administrativo
* **Dashboard:** Visão geral com KPIs de faturamento diário, contagem de vendas e alerta de estoque crítico.
* **Gestão de Estoque:** CRUD de produtos, histórico de movimentações e operações de ajuste (Entrada/Saída/Inventário).
* **Gestão de Usuários:** Controle de acesso e cadastro de novos operadores/administradores.
* **Relatórios:** Visualização detalhada de vendas com filtros por data, valor e operador.

### 🛒 Módulo Operacional (PDV)
* **Frente de Caixa:** Interface otimizada para vendas rápidas.
    * Busca de produtos por código.
    * Carrinho de compras dinâmico.
    * Cálculo automático de troco.
    * Geração de recibo em tela.
* **Meus Relatórios:** Acesso ao histórico de vendas para conferência.

## 6. Integração com API

Este frontend consome os seguintes recursos do backend:

| Recurso | Rota Base API | Utilização no Frontend |
| :--- | :--- | :--- |
| **Auth** | `/api/auth` | Login, Logout e Validação de Sessão. |
| **Produtos** | `/api/produtos` | Listagens, Busca por código (PDV) e Movimentações de estoque. |
| **Vendas** | `/api/vendas` | Registro de vendas (Checkout) e Listagem para relatórios. |
| **Usuários** | `/api/usuarios` | Listagem e gestão de contas de acesso. |
