import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { whmcsApi } from '../lib/whmcsApi';

export default function Services() {
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
        const res: any = await whmcsApi.getClientsProducts(user.clientId);
        setItems(res.products?.product || []);
      } catch (e: any) {
        setError(e?.message || 'Failed to load services');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  if (loading) return <div>Loading services...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-3">
      {items.map((p) => (
        <div key={p.id} className="rounded border border-gray-200 dark:border-gray-800 p-4">
          <div className="font-medium">{p.name}</div>
          <div className="text-sm text-gray-500">Status: {p.status}</div>
          <div className="text-sm">Next Due: {p.nextduedate}</div>
        </div>
      ))}
      {items.length === 0 && <div className="text-sm text-gray-500">No services found.</div>}
    </div>
  );
}

