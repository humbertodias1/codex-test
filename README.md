# Booking SaaS (Next.js 14 + Prisma + PostgreSQL)

## Folder structure

- `app/` - frontend pages and API routes
- `components/` - reusable UI components
- `lib/` - auth, prisma, validation, assignment logic
- `prisma/` - database schema

## Local setup

1. Copy env values:
   ```bash
   cp .env.example .env
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate prisma client and run migrations:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate -- --name init
   ```
4. Run app:
   ```bash
   npm run dev
   ```

## Deployment to Vercel

1. Push repo to GitHub.
2. Import project in Vercel.
3. Add env vars from `.env.example`.
4. Set build command:
   ```bash
   npm run build
   ```
5. Ensure managed PostgreSQL is connected and `DATABASE_URL` is set.

## API Routes

- `POST /api/register`
- `POST /api/login`
- `POST /api/logout`
- `POST /api/forgot-password`
- `POST /api/reset-password`
- `GET /api/bookings`
- `POST /api/bookings`
- `GET /api/technicians`
- `POST /api/technicians`
- `PUT /api/technicians/:id`
- `DELETE /api/technicians/:id`
- `POST /api/webhook/booking`
