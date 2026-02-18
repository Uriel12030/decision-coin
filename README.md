# Payroll Slip Check – בדיקת תלוש שכר חינם

MVP web application for free payroll-slip screening. Leads fill out an intake wizard, upload documents, and receive a reference number. An admin panel lets staff review, score, and manage leads.

## Tech Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS**
- **Supabase** (Postgres + Storage + Auth)
- **Zod** validation
- **Server Actions** for writes

## Local Setup

### 1. Clone & install

```bash
git clone <repo-url>
cd payroll-check
npm install
```

### 2. Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. Run the migration in `supabase/migrations/001_initial.sql` via the SQL Editor.
3. Create a **private** Storage bucket named `lead-files`.
4. Copy `.env.example` to `.env.local` and fill in your keys:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 3. Storage bucket policy

In the Supabase dashboard → Storage → `lead-files` → Policies:

- **No public access** (keep default private).
- Server actions use the **service role key** to upload, which bypasses RLS.
- Admin download uses signed URLs generated server-side.

### 4. Create an admin user

In Supabase dashboard → Authentication → Users → "Add user" with email + password.

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push to GitHub.
2. Import project in Vercel.
3. Add environment variables in Vercel project settings.
4. Deploy.

## Data Cleanup

Delete leads and files older than 60 days:

```bash
npm run cleanup
```

Or run directly:

```bash
SUPABASE_SERVICE_ROLE_KEY=... NEXT_PUBLIC_SUPABASE_URL=... npx tsx scripts/cleanup-old-leads.ts
```

## Project Structure

```
src/
  app/
    page.tsx              Landing page
    intake/page.tsx       Multi-step intake wizard
    thank-you/page.tsx    Confirmation page
    admin/
      login/page.tsx      Admin login
      leads/page.tsx      Leads list + filters
      leads/[id]/page.tsx Lead detail + PDF export
    api/
      upload/route.ts     File upload endpoint
      admin/case-pack/[id]/route.ts  PDF generation
  lib/
    types.ts              TypeScript interfaces
    schemas.ts            Zod validation schemas
    scoring.ts            Lead scoring engine
    actions.ts            Server actions
    supabase/
      client.ts           Browser Supabase client
      server.ts           Server Supabase clients
  components/
    intake/               Wizard steps
    ui/                   Shared UI components
supabase/
  migrations/             SQL migrations
scripts/
  cleanup-old-leads.ts    Data retention script
```
