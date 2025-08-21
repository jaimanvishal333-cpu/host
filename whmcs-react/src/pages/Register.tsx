import { useState } from 'react';
import type { FormEvent } from 'react';
import { whmcsApi } from '../lib/whmcsApi';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    address1: '',
    city: '',
    state: '',
    postcode: '',
    country: 'US',
    phonenumber: '',
    password2: '',
  });
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await whmcsApi.addClient({ ...form });
      toast.success('Account created. Please login.');
      navigate('/login');
    } catch (err: any) {
      toast.error(err?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Register</h1>
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">First name</label>
          <input value={form.firstname} onChange={(e)=>update('firstname', e.target.value)} className="w-full rounded border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Last name</label>
          <input value={form.lastname} onChange={(e)=>update('lastname', e.target.value)} className="w-full rounded border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" required />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Email</label>
          <input type="email" value={form.email} onChange={(e)=>update('email', e.target.value)} className="w-full rounded border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" required />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Address</label>
          <input value={form.address1} onChange={(e)=>update('address1', e.target.value)} className="w-full rounded border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm mb-1">City</label>
          <input value={form.city} onChange={(e)=>update('city', e.target.value)} className="w-full rounded border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm mb-1">State</label>
          <input value={form.state} onChange={(e)=>update('state', e.target.value)} className="w-full rounded border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Postcode</label>
          <input value={form.postcode} onChange={(e)=>update('postcode', e.target.value)} className="w-full rounded border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Country</label>
          <input value={form.country} onChange={(e)=>update('country', e.target.value)} className="w-full rounded border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Phone</label>
          <input value={form.phonenumber} onChange={(e)=>update('phonenumber', e.target.value)} className="w-full rounded border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Password</label>
          <input type="password" value={form.password2} onChange={(e)=>update('password2', e.target.value)} className="w-full rounded border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" required />
        </div>
        <div className="md:col-span-2">
          <button disabled={loading} className="w-full rounded bg-blue-600 text-white px-4 py-2 disabled:opacity-50">{loading? 'Creating...':'Create account'}</button>
        </div>
        <div className="md:col-span-2 text-sm">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </div>
      </form>
    </div>
  );
}

