import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { whmcsApi } from '../lib/whmcsApi';

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const res = await whmcsApi.getClientsDetails(user.clientId);
        setProfile(res);
      } catch (e: any) {
        setError(e?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="rounded border border-gray-200 dark:border-gray-800 p-4">
        <h2 className="font-semibold mb-2">Profile</h2>
        <div className="text-sm space-y-1">
          <div>Name: {profile?.client?.fullname}</div>
          <div>Email: {profile?.client?.email}</div>
          <div>Company: {profile?.client?.companyname || '-'}</div>
          <div>Services: {profile?.stats?.numproducts}</div>
          <div>Invoices Due: {profile?.stats?.numunpaidinvoices}</div>
        </div>
      </div>
      <div className="rounded border border-gray-200 dark:border-gray-800 p-4">
        <h2 className="font-semibold mb-2">Quick Links</h2>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>View <a href="/products" className="text-blue-600">Hosting Plans</a></li>
          <li>Open <a href="/tickets" className="text-blue-600">Support Ticket</a></li>
          <li>Check <a href="/invoices" className="text-blue-600">Invoices</a></li>
        </ul>
      </div>
    </div>
  );
}

