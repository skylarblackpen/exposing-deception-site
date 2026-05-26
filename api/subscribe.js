// Vercel / Netlify-style serverless function.
// Receives { email } from the site's signup form, forwards it to MailerLite's
// Create Subscriber endpoint using a server-side API key, and responds with
// a small JSON ack. The site opens Chapter 1 regardless of the response, so
// errors here just mean the address didn't reach MailerLite.
//
// Required environment variables (set these in your hosting dashboard, NOT
// committed to git):
//   MAILERLITE_API_KEY   — your MailerLite API key (long JWT-looking string)
//
// Optional:
//   MAILERLITE_GROUP_ID  — if set, new subscribers are added to this group.
//                          Get this from MailerLite → Subscribers → Groups →
//                          click your group → copy the ID from the URL.
//   SUBSCRIBE_SOURCE     — string saved to the subscriber's "source" field
//                          (defaults to "exposing-deception-site")

export default async function handler(req, res) {
  // CORS — only needed if you ever serve the site from a different origin
  // than the API. Same-origin (recommended) doesn't need this block.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "method-not-allowed" });
  }

  const { MAILERLITE_API_KEY, MAILERLITE_GROUP_ID } = process.env;
  if (!MAILERLITE_API_KEY) {
    return res.status(500).json({ ok: false, error: "server-misconfigured" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  const email = (body && body.email || "").trim().toLowerCase();
  const source = (body && body.source) || process.env.SUBSCRIBE_SOURCE || "exposing-deception-site";

  // Light validation — MailerLite will reject bad addresses anyway, but this
  // saves a round-trip.
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: "invalid-email" });
  }

  const payload = {
    email,
    fields: { source },
    status: "active"
  };
  if (MAILERLITE_GROUP_ID) {
    payload.groups = [MAILERLITE_GROUP_ID];
  }

  try {
    const resp = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${MAILERLITE_API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      return res.status(resp.status).json({ ok: false, error: data });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(502).json({ ok: false, error: String(err) });
  }
}
