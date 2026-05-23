-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users profile (extends Supabase auth.users)
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  currency text default 'THB',
  created_at timestamptz default now()
);

-- Wallets
create table public.wallets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  type text check (type in ('cash','bank','ewallet')) default 'cash',
  balance numeric(15,2) default 0,
  color text default '#14b8a6',
  icon text default '💵',
  created_at timestamptz default now()
);

-- Categories
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade,
  name text not null,
  icon text default '📦',
  color text default '#6b7280',
  type text check (type in ('income','expense','both')) default 'expense',
  is_default boolean default false,
  created_at timestamptz default now()
);

-- Transactions
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  wallet_id uuid references public.wallets(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  type text check (type in ('income','expense')) not null,
  amount numeric(15,2) not null check (amount > 0),
  note text,
  date date not null default current_date,
  created_at timestamptz default now()
);

-- Budgets
create table public.budgets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  amount numeric(15,2) not null,
  spent numeric(15,2) default 0,
  period text check (period in ('monthly','weekly','yearly')) default 'monthly',
  start_date date not null,
  end_date date not null,
  created_at timestamptz default now()
);

-- Recurring transactions
create table public.recurring_transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  wallet_id uuid references public.wallets(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  type text check (type in ('income','expense')) not null,
  amount numeric(15,2) not null,
  note text,
  frequency text check (frequency in ('daily','weekly','monthly','yearly')) default 'monthly',
  next_date date not null,
  active boolean default true,
  created_at timestamptz default now()
);

-- RLS Policies
alter table public.users enable row level security;
alter table public.wallets enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;
alter table public.budgets enable row level security;
alter table public.recurring_transactions enable row level security;

create policy "Users: own data" on public.users for all using (auth.uid() = id);
create policy "Wallets: own data" on public.wallets for all using (auth.uid() = user_id);
create policy "Categories: own or default" on public.categories for select using (auth.uid() = user_id or is_default = true);
create policy "Categories: own write" on public.categories for insert with check (auth.uid() = user_id);
create policy "Categories: own update" on public.categories for update using (auth.uid() = user_id);
create policy "Categories: own delete" on public.categories for delete using (auth.uid() = user_id);
create policy "Transactions: own data" on public.transactions for all using (auth.uid() = user_id);
create policy "Budgets: own data" on public.budgets for all using (auth.uid() = user_id);
create policy "Recurring: own data" on public.recurring_transactions for all using (auth.uid() = user_id);

-- Function: auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  -- Create default wallet
  insert into public.wallets (user_id, name, type, color, icon)
  values (new.id, 'Cash Wallet', 'cash', '#14b8a6', '💵');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
