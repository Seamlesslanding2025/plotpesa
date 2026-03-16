
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- User Roles Enum
create type user_role as enum ('owner', 'agent', 'buyer', 'admin');

-- Property Types Enum
create type plot_type as enum ('residential', 'commercial', 'agricultural');

-- Plot Status Enum
create type plot_status as enum ('draft', 'pending_verification', 'published', 'sold', 'expired');

-- Document Types Enum
create type document_type as enum ('title_deed', 'survey_map', 'agent_license', 'registration_cert');

-- Verification Status Enum
create type verification_status as enum ('pending', 'under_review', 'approved', 'rejected');

-- Subscription Tier Enum
create type subscription_tier as enum ('free', 'standard', 'premium');

-- Payment Status Enum
create type payment_status as enum ('pending', 'completed', 'failed');

-- Payment Type Enum
create type payment_type as enum ('subscription', 'verified_badge');

-- Users Profile Table (extends auth.users)
create table public.users_profile (
  id uuid references auth.users on delete cascade not null primary key,
  role user_role default 'buyer',
  full_name text,
  phone text,
  company_name text, -- for agents
  is_verified boolean default false,
  verified_agent_badge boolean default false,
  subscription_tier subscription_tier default 'free',
  subscription_expires_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on users_profile
alter table public.users_profile enable row level security;

-- Plots Table
create table public.plots (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users_profile(id) not null,
  title text not null,
  description text,
  plot_type plot_type not null,
  county text not null,
  location_details text,
  size_acres decimal,
  price_kes decimal not null,
  contact_phone text,
  contact_whatsapp text,
  latitude decimal,
  longitude decimal,
  status plot_status default 'draft',
  is_featured boolean default false,
  view_count integer default 0,
  images jsonb, -- array of image URLs
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone
);

-- Enable RLS on plots
alter table public.plots enable row level security;

-- Documents Table
create table public.documents (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users_profile(id) not null,
  plot_id uuid references public.plots(id), -- nullable, as some docs are user-level (agent license)
  document_type document_type not null,
  file_url text not null,
  file_name text,
  verification_status verification_status default 'pending',
  admin_notes text,
  reviewed_by uuid references public.users_profile(id),
  reviewed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on documents
alter table public.documents enable row level security;

-- Saved Plots Table
create table public.saved_plots (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users_profile(id) not null,
  plot_id uuid references public.plots(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, plot_id)
);

-- Enable RLS on saved_plots
alter table public.saved_plots enable row level security;

-- Inquiries Table
create table public.inquiries (
  id uuid default uuid_generate_v4() primary key,
  plot_id uuid references public.plots(id) not null,
  buyer_id uuid references public.users_profile(id) not null,
  message text not null,
  buyer_name text, -- Captured at time of inquiry or for guest inquiries (if allowed, currently schema suggests registered)
  buyer_phone text,
  buyer_email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on inquiries
alter table public.inquiries enable row level security;

-- Payments Table (Phase 2)
create table public.payments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users_profile(id) not null,
  amount decimal not null,
  payment_type payment_type not null,
  tier subscription_tier, -- if subscription
  transaction_ref text,
  status payment_status default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on payments
alter table public.payments enable row level security;


-- RLS POLICIES

-- users_profile
-- Users can view their own profile
create policy "Users can view own profile" on public.users_profile
  for select using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile" on public.users_profile
  for update using (auth.uid() = id);

-- Admins can view all profiles
create policy "Admins can view all profiles" on public.users_profile
  for select using (
    exists (
      select 1 from public.users_profile
      where id = auth.uid() and role = 'admin'
    )
  );
  
-- Admins can update all profiles
create policy "Admins can update all profiles" on public.users_profile
  for update using (
      exists (
      select 1 from public.users_profile
      where id = auth.uid() and role = 'admin'
    )
  );

-- plots
-- Everyone can view published plots
create policy "Public view published plots" on public.plots
  for select using (status = 'published');

-- Owners/Agents can view their own plots (any status)
create policy "Owners view own plots" on public.plots
  for select using (auth.uid() = user_id);

-- Owners/Agents can create plots
create policy "Owners create plots" on public.plots
  for insert with check (auth.uid() = user_id);

-- Owners/Agents can update their own plots
create policy "Owners update own plots" on public.plots
  for update using (auth.uid() = user_id);

-- Owners/Agents can delete their own plots
create policy "Owners delete own plots" on public.plots
  for delete using (auth.uid() = user_id);

-- Admins can view all plots
create policy "Admins view all plots" on public.plots
  for select using (
      exists (
      select 1 from public.users_profile
      where id = auth.uid() and role = 'admin'
    )
  );

-- Admins can update all plots (for verification)
create policy "Admins update all plots" on public.plots
  for update using (
      exists (
      select 1 from public.users_profile
      where id = auth.uid() and role = 'admin'
    )
  );

-- documents
-- Users can view their own documents
create policy "Users view own documents" on public.documents
  for select using (auth.uid() = user_id);

-- Users can upload documents
create policy "Users upload documents" on public.documents
  for insert with check (auth.uid() = user_id);

-- Admins can view all documents
create policy "Admins view all documents" on public.documents
  for select using (
      exists (
      select 1 from public.users_profile
      where id = auth.uid() and role = 'admin'
    )
  );

-- Admins can update documents (verification status)
create policy "Admins update documents" on public.documents
  for update using (
      exists (
      select 1 from public.users_profile
      where id = auth.uid() and role = 'admin'
    )
  );

-- saved_plots
-- Users can manage their own saved plots
create policy "Users manage saved plots" on public.saved_plots
  for all using (auth.uid() = user_id);

-- inquiries
-- Buyers can view their own inquiries
create policy "Buyers view own inquiries" on public.inquiries
  for select using (auth.uid() = buyer_id);

-- Buyers can create inquiries
create policy "Buyers create inquiries" on public.inquiries
  for insert with check (auth.uid() = buyer_id);

-- Plot owners can view inquiries for their plots
create policy "Owners view inquiries for their plots" on public.inquiries
  for select using (
    exists (
      select 1 from public.plots
      where id = public.inquiries.plot_id
      and user_id = auth.uid()
    )
  );

-- Storage Buckets Setup (Mock logic for SQL file, needs to be done in Supabase UI or via API usually, but defining here for reference)
-- insert into storage.buckets (id, name, public) values ('plot-images', 'plot-images', true);
-- insert into storage.buckets (id, name, public) values ('documents', 'documents', false);

-- Storage Policies (Conceptual)
-- plot-images: Public Read, Auth Insert (Owner), Auth Update categories
-- documents: Owner Read, Admin Read, Owner Insert
