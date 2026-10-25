# Vesterra Group website and admin

Full-stack Vesterra Group website with a protected management dashboard and
Cloudflare D1 persistence.

## Admin

Open `/admin` and sign in with the ChatGPT account allowed to access the Site.

The dashboard includes:

- enquiry and lead management;
- review approval and verification;
- gallery image/video links with visibility controls;
- hero, contact, social and SEO settings;
- live dashboard totals.

Approved reviews and published gallery items appear automatically on the public
website. Website enquiries are saved in the Leads inbox.

## Local development

```powershell
npm run dev -- --port 4173
```

Sign in locally through:

`http://127.0.0.1:4173/signin-with-chatgpt?return_to=/admin`

The local and hosted D1 databases are separate. Schema changes live in
`db/schema.ts` and generated migrations are under `drizzle/`.
