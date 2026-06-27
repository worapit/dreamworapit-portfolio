'use client';

import { useState } from 'react';

const PROJECT_TYPES = [
  { value: 'product-design',   label: 'Product design' },
  { value: 'design-system',    label: 'Design system' },
  { value: 'freelance-small',  label: 'Freelance — under $3k' },
  { value: 'freelance-medium', label: 'Freelance — $3k–$10k' },
  { value: 'freelance-large',  label: 'Freelance — $10k+' },
  { value: 'other',            label: 'Something else' },
];

const INITIAL_FIELDS = {
  firstName: '', lastName: '', email: '', projectType: '', message: '',
};

export default function ContactForm() {
  const [fields, setFields] = useState(INITIAL_FIELDS);
  const [fieldErrors, setFieldErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [statusMessage, setStatusMessage] = useState('');

  const update = (key) => (e) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    if (fieldErrors[key]) setFieldErrors((errs) => ({ ...errs, [key]: undefined }));
  };

  const validate = () => {
    const errors = {};
    if (!fields.firstName.trim()) errors.firstName = 'Required';
    if (!fields.lastName.trim())  errors.lastName  = 'Required';
    if (!fields.email.trim()) {
      errors.email = 'Required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      errors.email = 'Enter a valid email address';
    }
    if (!fields.projectType) errors.projectType = 'Required';
    if (!fields.message.trim()) errors.message = 'Required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    setStatus('submitting');
    setStatusMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus('error');
        setStatusMessage(data.error || 'Something went wrong. Please try again.');
        if (data.fields) setFieldErrors(data.fields);
        return;
      }

      setStatus('success');
      setFields(INITIAL_FIELDS);
    } catch {
      setStatus('error');
      setStatusMessage('Could not reach the server. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="contact-form__success" role="status">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="1.5" />
          <path d="M13 20.5l4.5 4.5L27 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h3>Message sent</h3>
        <p>Thanks for reaching out — I'll get back to you within a couple of days.</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-form__row contact-form__row--split">
        <div className="contact-form__field">
          <label htmlFor="cf-first-name">First name</label>
          <input
            id="cf-first-name"
            type="text"
            autoComplete="given-name"
            value={fields.firstName}
            onChange={update('firstName')}
            aria-invalid={!!fieldErrors.firstName}
            aria-describedby={fieldErrors.firstName ? 'cf-first-name-err' : undefined}
          />
          {fieldErrors.firstName && <span id="cf-first-name-err" className="contact-form__error">{fieldErrors.firstName}</span>}
        </div>
        <div className="contact-form__field">
          <label htmlFor="cf-last-name">Last name</label>
          <input
            id="cf-last-name"
            type="text"
            autoComplete="family-name"
            value={fields.lastName}
            onChange={update('lastName')}
            aria-invalid={!!fieldErrors.lastName}
            aria-describedby={fieldErrors.lastName ? 'cf-last-name-err' : undefined}
          />
          {fieldErrors.lastName && <span id="cf-last-name-err" className="contact-form__error">{fieldErrors.lastName}</span>}
        </div>
      </div>

      <div className="contact-form__row">
        <div className="contact-form__field">
          <label htmlFor="cf-email">Email address</label>
          <input
            id="cf-email"
            type="email"
            autoComplete="email"
            value={fields.email}
            onChange={update('email')}
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? 'cf-email-err' : undefined}
          />
          {fieldErrors.email && <span id="cf-email-err" className="contact-form__error">{fieldErrors.email}</span>}
        </div>
      </div>

      <div className="contact-form__row">
        <div className="contact-form__field">
          <label htmlFor="cf-project-type">Budget / project type</label>
          <select
            id="cf-project-type"
            value={fields.projectType}
            onChange={update('projectType')}
            aria-invalid={!!fieldErrors.projectType}
            aria-describedby={fieldErrors.projectType ? 'cf-project-type-err' : undefined}
          >
            <option value="" disabled>Select one…</option>
            {PROJECT_TYPES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          {fieldErrors.projectType && <span id="cf-project-type-err" className="contact-form__error">{fieldErrors.projectType}</span>}
        </div>
      </div>

      <div className="contact-form__row">
        <div className="contact-form__field">
          <label htmlFor="cf-message">Message / project details</label>
          <textarea
            id="cf-message"
            rows={5}
            value={fields.message}
            onChange={update('message')}
            aria-invalid={!!fieldErrors.message}
            aria-describedby={fieldErrors.message ? 'cf-message-err' : undefined}
          />
          {fieldErrors.message && <span id="cf-message-err" className="contact-form__error">{fieldErrors.message}</span>}
        </div>
      </div>

      {status === 'error' && (
        <p className="contact-form__status contact-form__status--error" role="alert">
          {statusMessage}
        </p>
      )}

      <button type="submit" className="contact-form__submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Send Request'}
      </button>
    </form>
  );
}
