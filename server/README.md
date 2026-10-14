# Yugva server (stage 1: structure, auth, roles)
1. `npm install`  2. `cp .env.example .env` and edit  3. `npm run seed`  4. `npm start` → http://localhost:3000
Tests: `npm test`. Migrations in `migrations/` run automatically on start. Roles and permissions live in `src/perms.js`.
Use a different `.env` per environment (development, staging, production).
