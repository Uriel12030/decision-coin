-- Payroll Check – initial schema
-- Run this in the Supabase SQL Editor

-- 1. Leads table
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'new'
    check (status in ('new','reviewing','rejected','accepted')),

  -- contact
  full_name text not null,
  phone text not null,
  email text not null,
  city text not null,

  -- employment
  employer_name text,
  role_title text,
  employment_type text,
  start_date date,
  end_date date,
  still_employed boolean,

  -- hours
  avg_monthly_salary numeric,
  paid_overtime text,
  overtime_hours_estimate text,
  attendance_tracking text,

  -- benefits
  pension_provided text,
  pension_rate_known text,
  travel_reimbursement text,
  vacation_balance_issue text,
  sick_days_issue text,

  -- termination
  termination_type text,
  termination_date date,
  reason_for_check text,

  -- meta
  consent boolean not null,
  marketing_source text,
  lead_score int,
  lead_flags jsonb,
  admin_notes text
);

-- 2. Files table
create table if not exists public.files (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  created_at timestamptz not null default now(),
  file_type text,
  original_filename text,
  storage_path text,
  mime_type text,
  size_bytes int
);

-- 3. Enable RLS
alter table public.leads enable row level security;
alter table public.files enable row level security;

-- 4. RLS policies
-- Authenticated users (admins) can read all leads
create policy "Admins can read leads"
  on public.leads for select
  to authenticated
  using (true);

-- Authenticated users can update leads (status, notes)
create policy "Admins can update leads"
  on public.leads for update
  to authenticated
  using (true)
  with check (true);

-- Authenticated users can read files
create policy "Admins can read files"
  on public.files for select
  to authenticated
  using (true);

-- No public select on leads or files (service role bypasses RLS for inserts)
-- Inserts from public intake go through server actions using the service role key.

-- 5. Indexes
create index if not exists idx_leads_status on public.leads(status);
create index if not exists idx_leads_created_at on public.leads(created_at desc);
create index if not exists idx_leads_score on public.leads(lead_score desc);
create index if not exists idx_files_lead_id on public.files(lead_id);
