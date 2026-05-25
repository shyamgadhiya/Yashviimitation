# Deploy Checklist

This project is a Vite frontend with Supabase as the backend. The recommended production setup is:

- frontend on Cloudflare Pages
- database, auth, and storage on Supabase
- custom domain connected to Cloudflare Pages

## Before You Deploy

1. Make sure the project builds locally:
   - `npm install`
   - `npm run build`
2. Confirm your Supabase admin/security setup is already applied:
   - `supabase-admin-hardening.sql`
   - `ADMIN_SECURITY_SETUP.md`
3. Keep your real local values in `.env.local`.
4. Use `.env.example` only as the template for Cloudflare Pages environment variables.

## Cloudflare Pages Settings

Create a new Pages project and connect your Git repository.

Use these exact settings:

- Framework preset: `Vite`
- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`

If Cloudflare asks for an install command, leave the default package-manager install behavior unless you have a custom need.

## Environment Variables In Cloudflare Pages

In Cloudflare Pages:

- Go to `Settings > Environment variables`
- Add these variables for Production
- Add the same values for Preview too if you want preview deployments to work correctly

Required variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Use the values from your local `.env.local`.

## Recommended Domain Setup

Recommended production setup:

- primary domain: `yourdomain.com`
- redirect or secondary domain: `www.yourdomain.com`

In Cloudflare Pages:

1. Open your Pages project
2. Go to `Custom domains`
3. Add `yourdomain.com`
4. Add `www.yourdomain.com`
5. Choose one as the primary domain

Recommended primary:

- `yourdomain.com`

Recommended redirect:

- `www.yourdomain.com` -> `yourdomain.com`

If your DNS is already on Cloudflare, this is usually automatic after confirmation.

## Supabase Production Settings

After your Cloudflare Pages domain is live, update Supabase:

1. Open your Supabase project
2. Go to `Authentication > URL Configuration`
3. Set `Site URL` to:
   - `https://yourdomain.com`
4. Add additional allowed URLs if needed:
   - `https://www.yourdomain.com`
   - `https://your-project.pages.dev`

Even though your current admin login is email/password, it is still best to keep your production URLs correct in Supabase.

## Production Launch Checklist

- `npm run build` succeeds
- Cloudflare Pages deployment succeeds
- `VITE_SUPABASE_URL` is set in Pages
- `VITE_SUPABASE_ANON_KEY` is set in Pages
- custom domain is connected
- Supabase `Site URL` matches your production domain
- `www` and root domain resolve correctly
- storefront loads products and categories
- admin login works on production
- image uploads still work from the admin panel

## Suggested Domain Mapping

Use this unless you specifically prefer `www` as the main site:

- `https://yourdomain.com` -> main website
- `https://www.yourdomain.com` -> redirect to main website

## Quick Deploy Summary

Cloudflare Pages values for this project:

- Build command: `npm run build`
- Output directory: `dist`
- Env vars:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

Supabase production URL values:

- Site URL: `https://yourdomain.com`
- Additional URL: `https://www.yourdomain.com`

If you share your real domain name, I can give you the exact final Cloudflare and Supabase values with your actual domain filled in.
