# ✨ Shine Glam - E-commerce Premium

Um sistema de comércio eletrônico Full Stack de alto padrão, desenvolvido para o nicho de beleza. Unindo uma interface visualmente impactante com uma infraestrutura moderna e performática.

---

## 🚀 Novidades e Diferenciais

### ⚡ Performance Instantânea
- **Cache Local (LocalStorage):** Implementamos um sistema de persistência que salva configurações, banners e categorias no navegador do cliente. O site carrega **instantaneamente** com os dados da última visita, eliminando atrasos visuais enquanto o servidor desperta.

### 🛍️ Experiência de Compra Refinada
- **Seleção de Variações:** Suporte completo para produtos com diferentes cores. Cada variação é tratada como um item único no carrinho, facilitando a escolha do cliente.
- **Checkout via WhatsApp:** Integração direta que envia o pedido formatado para o vendedor, incluindo detalhes de quantidade, preço e as **cores selecionadas**, agilizando a separação no estoque.

### 🔒 Gestão Total (Admin)
- **Painel de Controle:** Gestão completa de produtos, categorias e pedidos.
- **Personalização Dinâmica:** Altere banners, mensagens da barra de anúncios e carrossel de benefícios em tempo real sem mexer no código.

---

## 💻 Stack Tecnológica

| Camada | Tecnologias Principais |
| :--- | :--- |
| **Front-end** | React, Vite, TypeScript |
| **Estilização** | Tailwind CSS (Design System Premium), Lucide React |
| **Performance** | LocalStorage Caching Strategy |
| **Back-end** | Node.js, Express, TypeScript |
| **Banco de Dados** | PostgreSQL (Supabase), Prisma ORM |
| **Deploy** | Vercel (Front) & Render (Back) |

---

## ⚙️ Configuração do Ambiente

### Pré-requisitos
- **Node.js** (v18+)
- **PostgreSQL** (ou conta no Supabase)

### 1. Back-end
```bash
cd back-end
npm install
```
Configure o `.env`:
```env
DATABASE_URL="postgresql://USUARIO:SENHA@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
JWT_SECRET="sua_chave_segura"
PORT=3333
```
*Dica: Use a porta 6543 (Pooler) se estiver usando Supabase para evitar erros de conexão.*

```bash
npx prisma migrate deploy
npm run dev
```

### 2. Front-end
```bash
cd front-end
npm install
```
Configure o `.env`:
```env
VITE_API_URL="https://seu-backend-no-render.com"
```

```bash
npm run dev
```

---

## 🔐 Acesso Administrativo
- **Rota:** `/admin`
- **Credenciais Padrão:** Definidas via Seed no Prisma (`admin@shineglam.com` / `admin123`).

---
Desenvolvido com ❤️ **Shine Glam**.

