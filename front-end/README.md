# Shine Glam - Front-end

Loja virtual da Shine Glam, feita com React, TypeScript, Vite e Tailwind CSS.

## Como rodar

```bash
npm install
cp .env.example .env
npm run dev
```

No `.env`, defina `VITE_API_URL` com o endereço do back-end. Se ele não for definido, o front-end usa `http://localhost:3333`.

## Scripts

| Comando | O que faz |
| :--- | :--- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Verifica os tipos e gera a versão de produção em `dist/` |
| `npm run preview` | Serve localmente a versão gerada pelo build |
| `npm run lint` | Roda o ESLint |

## Estrutura

| Pasta | Conteúdo |
| :--- | :--- |
| `src/pages` | Páginas: Home, Loja, Detalhes do Produto, Login e Admin |
| `src/components` | Componentes da interface (cabeçalho, cards, carrinho, banners) |
| `src/components/ui` | Componentes base (botão, card, input, tabela) |
| `src/contexts` | Contextos de autenticação e carrinho |
| `src/lib` | Cliente HTTP (`axios.ts`) e utilitários |
