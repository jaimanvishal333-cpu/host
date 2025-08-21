import { useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'react-toastify';

// Simulated OTP verification screen. In production, wire to your email template or 2FA flow.
export default function OTPVerify() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (otp.trim().length === 6) {
        toast.success('OTP verified');
      } else {
        toast.error('Invalid OTP');
      }
    }, 600);
  }

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Verify OTP</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Enter 6-digit code</label>
          <input value={otp} onChange={(e)=>setOtp(e.target.value)} className="w-full rounded border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" />
        </div>
        <button disabled={loading} className="w-full rounded bg-blue-600 text-white px-4 py-2 disabled:opacity-50">{loading? 'Verifying...':'Verify'}</button>
      </form>
    </div>
  );
}

