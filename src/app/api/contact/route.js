import { NextResponse } from 'next/server';

const esc = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export async function POST(req) {
  try {
    const { name, email, company, projectType, budget, message } = await req.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      // Add RESEND_API_KEY to .env.local — see .env.local.example
      return NextResponse.json({ error: 'Email service is not configured.' }, { status: 500 });
    }

    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      // TODO: replace with a verified Resend sender once your domain is verified
      // e.g. 'Portfolio <noreply@yourdomain.com>'
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: ['worapit.m@gmail.com'],
      replyTo: email,
      subject: `New Portfolio Contact — ${name}`,
      html: `
        <h2 style="font-family:sans-serif;margin-bottom:16px">New contact from portfolio</h2>
        <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
          <tr><td style="padding:4px 12px 4px 0;color:#666;font-weight:600">Name</td><td>${esc(name)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#666;font-weight:600">Email</td><td>${esc(email)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#666;font-weight:600">Company</td><td>${esc(company) || '—'}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#666;font-weight:600">Project Type</td><td>${esc(projectType) || '—'}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#666;font-weight:600">Budget</td><td>${esc(budget) || '—'}</td></tr>
        </table>
        <hr style="margin:16px 0;border:none;border-top:1px solid #eee"/>
        <h3 style="font-family:sans-serif;font-size:14px;font-weight:600;margin-bottom:8px">Message</h3>
        <p style="font-family:sans-serif;font-size:14px;line-height:1.6;white-space:pre-wrap;color:#333">${esc(message)}</p>
      `,
    });

    if (error) throw new Error(error.message);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[/api/contact]', err);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again or email me directly.' },
      { status: 500 }
    );
  }
}
