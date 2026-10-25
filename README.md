# Vesterra Group website and admin

Full-stack Vesterra Group website with a protected management dashboard and
Cloudflare D1 persistence.

## Admin

Open `/admin` and sign in with the ChatGPT account allowed to access the Site.

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
