# ✨ Flavia Beauty - E-commerce de Alto Padrão

Um sistema de comércio eletrônico Full Stack desenvolvido para o nicho de beleza e maquiagem de luxo. O projeto combina uma interface visualmente deslumbrante e sofisticada (inspirada em grandes marcas do setor) com um back-end robusto para gestão total da loja.

---

## � Visão Geral e Funcionalidades

### 🛍️ Vitrine do Cliente (Front-end)
- **Design Ultra-Luxuoso:** Interface focada em conversão com estética premium. Utiliza fundos em tons creme, texturas de seda e mármore, e detalhes em *Rose Gold* metálico.
- **Banner Dinâmico:** O "Hero Banner" principal da loja consome uma imagem configurável via API, permitindo atualizações de campanha em tempo real.
- **Catálogo Elegante:** Exibição de produtos com tipografia mista (Serifada clássica e Sans-serif moderna) para um visual editorial.
- **Carrinho de Compras (Slide-over):** Gerenciamento de estado global (Context API) para adicionar itens, alterar quantidades e calcular o total suavemente.
- **Checkout Simplificado:** Fluxo de finalização de pedido rápido e sem atrito.

### 🔒 Painel Administrativo (Back-end & Admin)
- **Autenticação Segura:** Proteção de rotas via JWT e senhas com hash (Bcrypt).
- **Gestão de Configurações (Store Settings):** Painel para o administrador alterar a URL da imagem do banner principal da loja sem precisar tocar no código.
- **CRUD de Produtos:** Controle total sobre o catálogo (Cadastro, Edição, Inativação e Exclusão de maquiagens/cosméticos).
- **Gestão de Pedidos:** Visualização das compras dos clientes e atualização de status de entrega/pagamento.

---

## 💻 Stack Tecnológica

| Camada | Tecnologias Principais |
| :--- | :--- |
| **Front-end** | React, Vite, TypeScript |
| **Estilização** | Tailwind CSS (Tema Customizado Luxo), Lucide React |
| **Gerenciamento de Estado**| React Context API |
| **Back-end** | Node.js, Express, TypeScript |
| **Banco de Dados** | PostgreSQL, Prisma ORM |
| **Segurança** | Bcryptjs, JWT |

---

## ⚙️ Como rodar o projeto localmente

### Pré-requisitos
Certifique-se de ter o **Node.js** e o **PostgreSQL** instalados.

### 1. Configurando o Back-end
Abra o terminal, navegue até a pasta do back-end e instale as dependências:

```bash
cd back-end
npm install
```

Crie um arquivo `.env` na raiz da pasta `back-end` e adicione suas credenciais:

```env
DATABASE_URL="postgresql://SEU_USUARIO:SUA_SENHA@localhost:5432/flavia_beauty?schema=public"
JWT_SECRET="sua_chave_jwt_super_segura"
PORT=3333
```

Rode a migração para criar as tabelas (Produtos, Pedidos, Usuários e Configurações) e o script de seed para criar o admin inicial e o banner padrão:

```bash
npx prisma migrate dev
npx prisma db seed
```

Inicie a API:

```bash
npm run dev
```
*(A API estará rodando em http://localhost:3333)*

### 2. Configurando o Front-end
Abra um novo terminal, navegue até a pasta do front-end e instale as dependências:

```bash
cd front-end
npm install
```

Inicie a aplicação React:

```bash
npm run dev
```
*(A aplicação estará rodando em http://localhost:5173)*

---

## 🔐 Acesso Administrativo Padrão

Após rodar o script de Seed do Prisma, utilize as credenciais abaixo para acessar a rota `/admin`:

- **E-mail:** `admin@flaviabeauty.com`
- **Senha:** `admin123`

