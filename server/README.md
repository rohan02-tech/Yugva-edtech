# Yugva server (stage 1: structure, auth, roles)
1. `npm install`  2. `cp .env.example .env` and edit  3. `npm run seed`  4. `npm start` → http://localhost:3000
Tests: `npm test`. Migrations in `migrations/` run automatically on start. Roles and permissions live in `src/perms.js`.
Use a different `.env` per environment (development, staging, production).

## Stage 2
Staff panel: http://localhost:3000/admin.html (sign in with a staff account). The public site now loads programs and mentors from the server (falls back to built-in sample data if the server has none).
`npm run seed` also loads the 17 programs and 4 mentors. Student sign-in and the student dashboard are connected in a later stage.
