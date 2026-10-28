# Vesterra Group website and admin

Full-stack Vesterra Group website with a protected management dashboard and
Cloudflare D1 persistence.

## Cloudflare deployment

Cloudflare Git builds must define these build-time variables before running
`npm run build`:

- `CLOUDFLARE_D1_DATABASE_ID`: the real D1 database ID from the Cloudflare dashboard
- `CLOUDFLARE_D1_DATABASE_NAME`: the D1 database name (defaults to `site-creator-d1`)

The generated `dist/server/wrangler.json` receives those values during the
build. Never commit a production database ID as a replacement for the local
placeholder.

After creating the database, initialize it once:

```sh
npx wrangler d1 execute <database-name> --remote --file=drizzle/0000_bizarre_mysterio.sql
npx wrangler d1 execute <database-name> --remote --file=drizzle/0001_plain_vance_astro.sql
```

For standalone Cloudflare hosting, configure these encrypted Worker secrets:

- `ADMIN_PASSWORD`: the private password used at `/admin/login`
- `ADMIN_SESSION_SECRET`: a random value of at least 32 characters used to sign login sessions

Optional runtime values are `ADMIN_EMAIL` and `ADMIN_NAME`.

## Admin

Open `/admin`. Standalone Cloudflare deployments use the encrypted admin
password configured above; Sites-hosted deployments continue to accept the
platform-provided ChatGPT identity.

The dashboard includes:

- property listing creation, editing, homepage featuring and publishing;
- enquiry and lead management;
- review approval and verification;
- gallery image/video links with visibility controls;
- hero, contact, social and SEO settings;
- live dashboard totals.

Published properties appear on `/properties`, each with its own detail page.
Featured properties also appear on the home page. Approved reviews and
published gallery items appear automatically, while website enquiries are saved
in the Leads inbox.

The public website also has dedicated `/about`, `/services`, `/properties` and
`/contact` routes, with shared navigation, transitions and responsive layouts.

## Local development

```powershell
npm run dev -- --port 4173
```

Sign in locally through:

`http://127.0.0.1:4173/signin-with-chatgpt?return_to=/admin`

The local and hosted D1 databases are separate. Schema changes live in
`db/schema.ts` and generated migrations are under `drizzle/`.

Deployment source: Cloudflare Workers via the `main` branch.
