-- Yashvi Imitation admin hardening
--
-- Run this in the Supabase SQL editor after you create the real admin user
-- in Authentication > Users.
--
-- Before running:
-- 1. Replace owner@example.com below with your real admin email.
-- 2. Make sure the products, categories, and product-images bucket already exist.
-- 3. Keep the product-images bucket public if you want storefront images to remain public.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

drop policy if exists "admin_users_select_self" on public.admin_users;
create policy "admin_users_select_self"
on public.admin_users
for select
to authenticated
using (auth.uid() = user_id);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

insert into public.admin_users (user_id, email)
select id, email
from auth.users
where email = 'shyamgadhiya502@gmail.com'
on conflict (user_id) do update
set email = excluded.email;

alter table public.products enable row level security;
alter table public.categories enable row level security;

drop policy if exists "public_read_products" on public.products;
create policy "public_read_products"
on public.products
for select
to anon, authenticated
using (true);

drop policy if exists "admin_insert_products" on public.products;
create policy "admin_insert_products"
on public.products
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "admin_update_products" on public.products;
create policy "admin_update_products"
on public.products
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin_delete_products" on public.products;
create policy "admin_delete_products"
on public.products
for delete
to authenticated
using (public.is_admin());

drop policy if exists "public_read_categories" on public.categories;
create policy "public_read_categories"
on public.categories
for select
to anon, authenticated
using (true);

drop policy if exists "admin_insert_categories" on public.categories;
create policy "admin_insert_categories"
on public.categories
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "admin_update_categories" on public.categories;
create policy "admin_update_categories"
on public.categories
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin_delete_categories" on public.categories;
create policy "admin_delete_categories"
on public.categories
for delete
to authenticated
using (public.is_admin());

drop policy if exists "admin_upload_product_images" on storage.objects;
create policy "admin_upload_product_images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'product-images'
  and public.is_admin()
);

drop policy if exists "admin_update_product_images" on storage.objects;
create policy "admin_update_product_images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'product-images'
  and public.is_admin()
)
with check (
  bucket_id = 'product-images'
  and public.is_admin()
);

drop policy if exists "admin_delete_product_images" on storage.objects;
create policy "admin_delete_product_images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'product-images'
  and public.is_admin()
);
