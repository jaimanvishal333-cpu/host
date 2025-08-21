import { useState } from 'react';
import type { FormEvent } from 'react';
import { whmcsApi } from '../lib/whmcsApi';
import { toast } from 'react-toastify';

// Simulate OTP by sending an email using SendEmail with a custom email template id/name.
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // You need to configure an email template in WHMCS and reference it here.
      await whmcsApi.sendEmail({ messagename: 'Password Reset Verification', id: email, customtype: 'general' });
      toast.success('If the email exists, a reset email was sent.');
    } catch (err: any) {
      toast.error(err?.message || 'Unable to send reset email');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Forgot password</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="w-full rounded border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" />
        </div>
        <button disabled={loading} className="w-full rounded bg-blue-600 text-white px-4 py-2 disabled:opacity-50">{loading? 'Sending...':'Send reset email'}</button>
      </form>
    </div>
  );
}

