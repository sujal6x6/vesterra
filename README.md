# Vesterra Group website

Premium one-page website for Vesterra Group, themed around the supplied black-and-gold identity.

## Preview locally

From the `vesterra-site` directory:

```powershell
python -m http.server 4173 --directory dist
```

Then open `http://localhost:4173`.

## Structure

- `dist/index.html` — page content and structure
- `dist/styles.css` — responsive visual system
- `dist/main.js` — navigation, scroll reveals, and WhatsApp enquiry flow
- `dist/assets/vesterra-logo.jpeg` — supplied client logo

The contact form opens WhatsApp with the visitor's enquiry pre-filled. No database or backend is required.
