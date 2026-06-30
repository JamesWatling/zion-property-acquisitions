/**
 * Zion Property Acquisitions — contact-form Worker
 * Receives a POST from the site's contact form and emails the lead via Resend.
 * Runs at zionpropertyacquisitions.com/api/contact (see wrangler.toml route),
 * so the form can POST same-origin. RESEND_API_KEY is a Worker secret.
 */
export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const cors = {
      "Access-Control-Allow-Origin": origin || "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin",
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405, cors);

    // Parse JSON or form-encoded
    let data = {};
    const ct = request.headers.get("content-type") || "";
    try {
      if (ct.includes("application/json")) data = await request.json();
      else data = Object.fromEntries((await request.formData()).entries());
    } catch {
      return json({ error: "Bad request" }, 400, cors);
    }

    // Honeypot: real users never fill the hidden "company" field
    if (data.company) return json({ ok: true }, 200, cors);

    const name = String(data.name || "").trim();
    const contact = String(data.contact || "").trim();
    const address = String(data.address || "").trim();
    const message = String(data.message || "").trim();
    if (!name || !contact) return json({ error: "Name and contact are required." }, 422, cors);

    const html = `
      <h2 style="font-family:Georgia,serif;color:#9c3b1b">New lead — Zion Property Acquisitions</h2>
      <table style="font-family:Arial,sans-serif;font-size:15px;border-collapse:collapse">
        <tr><td style="padding:4px 10px"><b>Name</b></td><td style="padding:4px 10px">${esc(name)}</td></tr>
        <tr><td style="padding:4px 10px"><b>Contact</b></td><td style="padding:4px 10px">${esc(contact)}</td></tr>
        <tr><td style="padding:4px 10px"><b>Property</b></td><td style="padding:4px 10px">${esc(address) || "—"}</td></tr>
        <tr><td style="padding:4px 10px;vertical-align:top"><b>Message</b></td><td style="padding:4px 10px">${esc(message).replace(/\n/g, "<br>") || "—"}</td></tr>
      </table>`;

    const body = {
      from: "Zion Property Acquisitions <info@zionpropertyacquisitions.com>",
      to: ["info@zionpropertyacquisitions.com"],
      subject: `New lead: ${name}${address ? " — " + address : ""}`,
      html,
    };
    // Let you hit "reply" straight back to the seller if they left an email
    if (contact.includes("@")) body.reply_to = contact;

    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!r.ok) return json({ error: "Send failed", detail: await r.text() }, 502, cors);
    return json({ ok: true }, 200, cors);
  },
};

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}
function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), { status, headers: { ...headers, "Content-Type": "application/json" } });
}
