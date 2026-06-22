# Quizora Frontend

React + Vite frontend for Quizora, ported from `quizora-home-v3 (2).html`.

## Structure

```
frontend/
├── public/assets/          # Static assets (mascot image)
├── src/
│   ├── components/
│   │   ├── home/           # Hero chat, composer, results
│   │   └── layout/         # Sidebar, header, topbar
│   ├── hooks/              # React hooks (quiz composer logic)
│   ├── lib/                # Questions, file/PDF helpers
│   ├── styles/             # Extracted CSS from HTML prototype
│   └── types/              # TypeScript types
```

## Commands

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Backend

A Laravel backend folder will be added separately. The mock question generator in `src/lib/questions.ts` is ready to be replaced with API calls to Laravel.
