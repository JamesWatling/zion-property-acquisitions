# Contact-form Worker (Cloudflare + Resend)

Receives the site's contact form POST and emails the lead to `info@zionpropertyacquisitions.com` via Resend.

## Prereqs (one-time)
1. **Resend:** create an account, **verify the domain** `zionpropertyacquisitions.com` (add the DKIM/SPF records Resend gives you into Cloudflare DNS, grey-cloud). Create an **API key**.
2. **Wrangler** (Cloudflare CLI): `npm install` here, then `npx wrangler login`.

## Deploy
```bash
cd worker
npm install
npx wrangler login
npx wrangler secret put RESEND_API_KEY   # paste your Resend key when prompted
npx wrangler deploy
```
`wrangler deploy` reads `wrangler.toml` and binds the route **zionpropertyacquisitions.com/api/contact** automatically (your domain is already on Cloudflare).

## How it connects to the site
The site form POSTs JSON to `/api/contact` (same origin, since the domain is proxied through Cloudflare → no CORS). The Worker validates, drops bots via a honeypot, and sends the email. Lead emails set `reply-to` to the visitor's email so you can reply straight back.

## Test
```bash
curl -X POST https://zionpropertyacquisitions.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Seller","contact":"test@example.com","address":"123 Main St","message":"Just testing"}'
# -> {"ok":true}  and an email lands in info@…
```

## Alternative: workers.dev (no custom route)
If you'd rather not bind the route, remove the `routes` block, `wrangler deploy` to get a `https://zion-contact.<you>.workers.dev` URL, and change `ENDPOINT` in the site's `index.html` to that URL. The Worker already returns CORS headers for cross-origin posts.
