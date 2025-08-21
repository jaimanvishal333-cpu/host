import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { whmcsApi } from '../lib/whmcsApi';
import { toast } from 'react-toastify';

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      if (!user) return;
      setLoading(true);
      const res: any = await whmcsApi.getClientsDetails(user.clientId);
      const c = res.client || {};
      setForm({
        firstname: c.firstname || '',
        lastname: c.lastname || '',
        email: c.email || '',
        address1: c.address1 || '',
        city: c.city || '',
        state: c.state || '',
        postcode: c.postcode || '',
        country: c.country || 'US',
        phonenumber: c.phonenumber || '',
      });
      setLoading(false);
    }
    load();
  }, [user]);

  function update<K extends keyof typeof form>(key: K, value: any) {
    setForm((f: any) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await whmcsApi.updateClient(user.clientId, form);
      toast.success('Profile updated');
    } catch (e: any) {
      toast.error(e?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">First name</label>
          <input value={form.firstname} onChange={(e)=>update('firstname', e.target.value)} className="w-full rounded border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">Last name</label>
          <input value={form.lastname} onChange={(e)=>update('lastname', e.target.value)} className="w-full rounded border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Email</label>
          <input type="email" value={form.email} onChange={(e)=>update('email', e.target.value)} className="w-full rounded border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Address</label>
          <input value={form.address1} onChange={(e)=>update('address1', e.target.value)} className="w-full rounded border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">City</label>
          <input value={form.city} onChange={(e)=>update('city', e.target.value)} className="w-full rounded border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">State</label>
          <input value={form.state} onChange={(e)=>update('state', e.target.value)} className="w-full rounded border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">Postcode</label>
          <input value={form.postcode} onChange={(e)=>update('postcode', e.target.value)} className="w-full rounded border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" />
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
          <button disabled={saving} className="rounded bg-blue-600 text-white px-4 py-2 disabled:opacity-50">{saving? 'Saving...':'Save Changes'}</button>
        </div>
      </form>
    </div>
  );
}

