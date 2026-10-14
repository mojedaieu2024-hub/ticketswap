-- TicketSwap: tickets table with Row Level Security
-- Paste this whole file into Supabase → SQL Editor → New query → Run.

create table if not exists public.tickets (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  description text not null check (char_length(description) between 1 and 500),
  contact     text not null default '' check (char_length(contact) <= 100),
  created_at  timestamptz not null default now()
);

create index if not exists tickets_created_at_idx on public.tickets (created_at desc);

-- Row Level Security: ON. Nobody (anon) can read anything without logging in.
alter table public.tickets enable row level security;

-- Table access for logged-in users only (RLS policies below still limit each row).
revoke all on public.tickets from anon;
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.tickets to authenticated;

-- Make the Supabase API pick up the new permissions right away.
notify pgrst, 'reload schema';

drop policy if exists "Logged-in users can read all tickets" on public.tickets;
create policy "Logged-in users can read all tickets"
  on public.tickets for select
  to authenticated
  using (auth.uid() is not null);

drop policy if exists "Users can post tickets as themselves" on public.tickets;
create policy "Users can post tickets as themselves"
  on public.tickets for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can edit their own tickets" on public.tickets;
create policy "Users can edit their own tickets"
  on public.tickets for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own tickets" on public.tickets;
create policy "Users can delete their own tickets"
  on public.tickets for delete
  to authenticated
  using (auth.uid() = user_id);
