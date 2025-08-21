import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { whmcsApi } from '../lib/whmcsApi';

export default function Domains() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const res: any = await whmcsApi.getClientsDomains(user.clientId);
        setItems(res.domains?.domain || []);
      } catch (e: any) {
        setError(e?.message || 'Failed to load domains');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  if (loading) return <div>Loading domains...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-3">
      {items.map((d) => (
        <div key={d.id} className="rounded border border-gray-200 dark:border-gray-800 p-4">
          <div className="font-medium">{d.domainname}</div>
          <div className="text-sm text-gray-500">Status: {d.status} • Next Due: {d.nextduedate}</div>
        </div>
      ))}
      {items.length === 0 && <div className="text-sm text-gray-500">No domains found.</div>}
    </div>
  );
}

