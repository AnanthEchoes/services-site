// functions/contact.js
export async function onRequestPost(context) {
  const { request, env } = context;

  // parse the incoming form
  const form = await request.formData();
  const token = form.get('cf-turnstile-response');

  if (!token) {
    return new Response(JSON.stringify({ success: false, error: 'missing-token' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  // get secret from env (set this in Pages dashboard / wrangler)
  const SECRET = env.CF_TURNSTILE_SECRET;
  if (!SECRET) {
    return new Response(JSON.stringify({ success: false, error: 'missing-server-secret' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  // remote IP (Cloudflare sets CF-Connecting-IP). optional.
  const remoteip = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For');

  // verify with Cloudflare
  const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: SECRET, response: token, remoteip })
  });

  const verification = await verifyRes.json();

  if (!verification.success) {
    // possible verification errors in verification['error-codes']
    return new Response(JSON.stringify({ success: false, verification }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  // token valid — process the form (example: simple logging or store in KV / D1 / send email)
  const name = form.get('name') || 'Anonymous';
  const email = form.get('email') || '';
  const message = form.get('message') || '';

  // Example: write to a KV binding if you added one (binding name: MESSAGES_KV)
  try {
    if (env.MESSAGES_KV) {
      const id = crypto.randomUUID();
      await env.MESSAGES_KV.put(`msg:${id}`, JSON.stringify({ name, email, message, createdAt: new Date().toISOString(), ip: remoteip }));
    } else {
      // fallback: log (visible in Pages function logs)
      console.log('Contact submission', { name, email, message, ip: remoteip });
    }
  } catch (err) {
    console.error('store error', err);
  }

  // respond (JSON for AJAX, or redirect if you prefer)
  return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
