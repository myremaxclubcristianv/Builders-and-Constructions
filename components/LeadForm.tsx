'use client';
import { FormEvent, useState } from 'react';

type LeadKind = 'work' | 'promote' | 'project';

export function LeadForm({
  kind,
  company,
  source = 'work_with_us'
}: {
  kind: LeadKind;
  company?: string;
  source?: string;
}) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState('sending');
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          company: form.get('company'),
          email: form.get('email'),
          phone: form.get('phone'),
          requestType: form.get('requestType'),
          message: form.get('message'),
          source,
          leadType: 'research_request'
        })
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || "We couldn't submit the request right now. Please try again shortly.");
        setState('error');
        return;
      }
      setMessage(data.message || 'Request received. The CONSTRUCTIONS research team will review it.');
      setState('sent');
    } catch {
      setMessage("We couldn't submit the request right now. Please try again shortly.");
      setState('error');
    }
  };

  if (state === 'sent') {
    return (
      <div className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-xl text-center space-y-2 font-mono">
        <span className="text-[#86efac] text-xs font-bold uppercase block">REQUEST SUBMITTED</span>
        <p className="text-white text-sm">{message}</p>
      </div>
    );
  }

  const options = [
    'Institutional Research Mandate',
    'Site & Technical Due Diligence',
    'Data Verification & Audit',
    'Regional Market Intelligence',
    'Platform Partnership',
    'Drone & Site Media Coverage',
    'Profile Update Request',
    'Other Research Inquiry'
  ];

  return (
    <form className="form-grid" onSubmit={submit} noValidate>
      <label>
        <span className="form-label">Name</span>
        <input name="name" required autoComplete="name" placeholder="Name *" />
      </label>
      <label>
        <span className="form-label">Company / Organization</span>
        <input name="company" autoComplete="organization" placeholder="Organization" />
      </label>
      <label>
        <span className="form-label">Business email</span>
        <input name="email" required type="email" autoComplete="email" placeholder="Business email *" />
      </label>
      <label>
        <span className="form-label">Phone</span>
        <input name="phone" autoComplete="tel" placeholder="Phone" />
      </label>
      {company && (
        <label className="full">
          <span className="form-label">Target Entity</span>
          <input className="full" value={company} readOnly aria-label="Target Entity" />
        </label>
      )}
      <label className="full">
        <span className="form-label">Research Category</span>
        <select name="requestType" required defaultValue="">
          <option value="" disabled>Select category *</option>
          {options.map(x => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </label>
      <label className="full">
        <span className="form-label">Message Details</span>
        <textarea name="message" placeholder="Detail your research mandate or platform inquiry..." />
      </label>
      {state === 'error' && <p className="form-error full" role="alert">{message}</p>}
      <button className="btn fill full" disabled={state === 'sending'} type="submit">
        {state === 'sending' ? 'Sending…' : 'Submit Research Request'}
      </button>
    </form>
  );
}
