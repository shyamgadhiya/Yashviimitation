# Admin Security Setup

The website now uses real Supabase email/password login for admin access. To finish the hardening, apply the backend setup below.

## What changed in the site

- The hardcoded browser admin password was removed.
- Admin login now uses Supabase Auth email + password.
- The site checks whether the signed-in user exists in `public.admin_users`.
- Admin writes now rely on Supabase authorization instead of a front-end-only gate.

## Supabase steps

1. In Supabase, create the single real admin user in `Authentication > Users`.
2. Open `supabase-admin-hardening.sql`.
3. Replace `owner@example.com` with that real admin email.
4. Run the SQL in the Supabase SQL editor.
5. Make sure the `product-images` bucket stays public if you want storefront images to continue loading through public URLs.

## What the SQL does

- Creates `public.admin_users` as the allowlist of admin accounts.
- Adds `public.is_admin()` for RLS and storage policy checks.
- Keeps public `SELECT` on `products` and `categories`.
- Restricts `INSERT`, `UPDATE`, and `DELETE` on `products` and `categories` to the approved admin user.
- Restricts `product-images` uploads and other storage writes to the approved admin user.

## Expected behavior after setup

- Anyone can still browse the storefront while signed out.
- Only the approved admin account can open the admin panel successfully.
- Anonymous users and non-admin users cannot create, edit, delete, or upload catalog data.
