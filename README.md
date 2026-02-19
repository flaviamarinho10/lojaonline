# 🛒 SupleStore - E-commerce de Suplementos (MVP)

Um sistema completo de comércio eletrônico (Ponta a Ponta) focado em uma experiência de alta conversão para venda de suplementos esportivos. O projeto conta com uma interface moderna e imersiva em **Dark Mode Premium** para os clientes e um painel administrativo seguro e dinâmico para a gestão da loja.

---

## 🚀 Principais Funcionalidades

### 🛍️ Área Pública (Vitrine do Cliente)
- **Catálogo Dinâmico:** Listagem de produtos vindos da API com Skeleton Loading e tratamento de estados vazios.
- **Design Premium:** Interface moderna em *Dark Mode* (fundo escuro com detalhes em `emerald-500`).
- **Carrinho de Compras (Slide-over):** Adição de itens, controle de quantidades (+/-), remoção e cálculo de total em tempo real via Context API.
- **Checkout Simplificado:** Finalização rápida de pedido informando apenas o e-mail (focado em conversão e MVP).

### 🔒 Área Administrativa (Painel Admin)
- **Autenticação Segura:** Login protegido com JWT (JSON Web Tokens) e senhas criptografadas (Bcrypt).
- **Gestão de Produtos (CRUD Completo):** Cadastro, edição, inativação e exclusão de suplementos.
- **Gestão de Pedidos:** Visualização detalhada das compras realizadas e controle do funil de status (`PENDENTE`, `CONCLUIDO`, `CANCELADO`).

---

## 💻 Stack Tecnológica

| Camada | Tecnologias Principais |
| :--- | :--- |
| **Front-end** | React, Vite, TypeScript |
| **Estilização** | Tailwind CSS (Dark Mode), Lucide React (Ícones) |
| **Gerenciamento de Estado**| React Context API (CartContext, AuthContext) |
| **Back-end** | Node.js, Express, TypeScript |
| **Banco de Dados** | PostgreSQL, Prisma ORM |
| **Segurança** | Bcryptjs, JWT (JSON Web Tokens) |

---

## 📂 Estrutura do Projeto

O projeto adota uma arquitetura de monorepo simples, dividida em duas raízes principais:

```text
/
├── back-end/                # API RESTful, Banco de dados e Autenticação
│   ├── prisma/              # Schema do banco de dados e Seeders
│   ├── src/                 # Servidor Express, Rotas e Middlewares
│   └── .env                 # Variáveis de ambiente (DB e JWT)
│
└── front-end/               # Interface do Cliente e do Admin
    ├── src/
    │   ├── components/      # Componentes reutilizáveis (ProductCard, CartSidebar)
    │   ├── contexts/        # Estados globais (CartContext, AuthContext)
    │   ├── pages/           # Telas (Home, AdminLogin, AdminDashboard)
    │   └── App.tsx          # Configuração de Rotas (React Router)
    └── tailwind.config.js   # Configurações do tema escuro