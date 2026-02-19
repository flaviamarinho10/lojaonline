# Loja Online MVP

## Setup

### Prerequisites
- Node.js
- PostgreSQL running locally

### Backend
1. Navigate to `back-end`
2. Configure `.env` with your `DATABASE_URL`
3. Install dependencies: `npm install`
4. Run migrations: `npx prisma migrate dev`
5. Start server: `npm run dev` (or `npx ts-node src/server.ts`)

### Frontend
1. Navigate to `front-end`
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`

## Features implemented
- Project structure (React + Express)
- Tailwind CSS + Shadcn UI setup
- Basic API routes (Products, Orders)
- Frontend skeletons (Store, Admin, Cart)