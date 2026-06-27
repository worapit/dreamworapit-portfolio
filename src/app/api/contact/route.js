import { Resend } from 'resend';

// TODO(env): set these in .env.local (and in your hosting provider's
// environment settings for production):
//   RESEND_API_KEY   — get one at https://resend.com/api-keys (free tier
//                       is enough for a portfolio contact form)
//   CONTACT_TO_EMAIL  — defaults to worapit.m@gmail.com below if unset
//   CONTACT_FROM_EMAIL — the "from" address Resend sends as. Until a
//                       domain is verified with Resend, use their
//                       shared sandbox sender: onboarding@resend.dev
const TO_EMAIL   = process.env.CONTACT_TO_EMAIL || 'worapit.m@gmail.com';
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev';

const REQUIRED_FIELDS = ['firstName', 'lastName', 'email', 'projectType', 'message'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(body) {
  const errors = {};
  for (const field of REQUIRED_FIELDS) {
    if (!body?.[field] || !String(body[field]).trim()) {
      errors[field] = 'Required';
    }
  }
  if (body?.email && !EMAIL_RE.test(body.email)) {
    errors.email = 'Enter a valid email address';
  }
  return errors;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const errors = validate(body);
  if (Object.keys(errors).length) {
    return Response.json({ error: 'Please check the highlighted fields', fields: errors }, { status: 422 });
  }

  const { firstName, lastName, email, projectType, message } = body;

  if (!process.env.RESEND_API_KEY) {
    // TODO(env): RESEND_API_KEY is not set — see comment block above.
    // Logged server-side so submissions aren't silently lost during
    // local development before the key is configured.
    console.error('[api/contact] RESEND_API_KEY is not set — email not sent.', {
      firstName, lastName, email, projectType,
    });
    return Response.json(
      { error: 'Email service is not configured yet. Please email worapit.m@gmail.com directly.' },
      { status: 503 }
    );
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: `w0rapit Portfolio <${FROM_EMAIL}>`,
      to: TO_EMAIL,
      replyTo: email,
      subject: `New project enquiry — ${firstName} ${lastName}`,
      text:
        `Name: ${firstName} ${lastName}\n` +
        `Email: ${email}\n` +
        `Budget / project type: ${projectType}\n\n` +
        `${message}`,
    });

    if (error) {
      console.error('[api/contact] Resend error:', error);
      return Response.json({ error: 'Could not send your message. Please try again.' }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error('[api/contact] Unexpected error:', err);
    return Response.json({ error: 'Could not send your message. Please try again.' }, { status: 500 });
  }
}
