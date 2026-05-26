# SEO and Lead Setup

This project now includes:

- route-based public URLs for home, collection, occasion, category, and product pages
- page-level SEO tags through `react-helmet-async`
- automatic `robots.txt` and `sitemap.xml` generation during `npm run build`
- optional Google Analytics tracking for page views and lead clicks

## 1. Required environment variables

Add these values to your local `.env.local` and Cloudflare Pages environment variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SITE_URL`

Recommended `VITE_SITE_URL`:

- `https://yourdomain.com`

Optional variables:

- `VITE_GA_MEASUREMENT_ID`
- `VITE_GOOGLE_SITE_VERIFICATION`

## 2. Google Search Console

Recommended method:

1. Open Google Search Console
2. Add your domain property
3. Use DNS verification in Cloudflare
4. After verification, submit:
   - `https://yourdomain.com/sitemap.xml`

Optional alternative:

- If you use HTML tag verification instead of DNS, set `VITE_GOOGLE_SITE_VERIFICATION`

## 3. Google Analytics 4

1. Create a GA4 property for your website
2. Copy the measurement ID like `G-XXXXXXXXXX`
3. Set `VITE_GA_MEASUREMENT_ID` in local and production env vars
4. Rebuild and redeploy the site

Tracked events now include:

- page views
- WhatsApp clicks
- call clicks
- map/store visit clicks

## 4. Build output

When you run `npm run build`, the project will generate:

- `public/robots.txt`
- `public/sitemap.xml`

The sitemap automatically includes:

- `/`
- `/collection`
- occasion pages
- category pages from Supabase
- product pages from Supabase

If `VITE_SITE_URL` is missing, the sitemap will use a placeholder domain. Set the real domain before production deploys.

## 5. After deployment

After the new build is live:

1. Open `https://yourdomain.com/robots.txt`
2. Open `https://yourdomain.com/sitemap.xml`
3. Inspect a few product pages in Google Search Console URL Inspection
4. Verify page titles and descriptions appear correctly when sharing links
5. Check GA4 Realtime while clicking:
   - WhatsApp
   - Call
   - Visit Store

## 6. Local SEO checklist

- Keep the exact same business name, phone, address, and city on:
  - website footer
  - Google Business Profile
  - Instagram bio/contact details
- Upload fresh store, product, bridal, and customer styling photos on Google Business Profile
- Ask happy customers for Google reviews regularly
- Publish Google Business posts for festive edits, bridal arrivals, and offers
