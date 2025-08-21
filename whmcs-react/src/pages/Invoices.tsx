import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { buildInvoiceUrl, whmcsApi } from '../lib/whmcsApi';

export default function Invoices() {
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
        const res: any = await whmcsApi.getInvoices(user.clientId);
        setItems(res.invoices?.invoice || []);
      } catch (e: any) {
        setError(e?.message || 'Failed to load invoices');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  if (loading) return <div>Loading invoices...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-3">
      {items.map((inv) => (
        <div key={inv.id} className="rounded border border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
          <div>
            <div className="font-medium">Invoice #{inv.invoicenum || inv.id}</div>
            <div className="text-sm text-gray-500">Total: {inv.total} • Status: {inv.status}</div>
          </div>
          <a className="rounded bg-blue-600 text-white px-3 py-1 text-sm" href={buildInvoiceUrl(inv.id)} target="_blank" rel="noreferrer">Pay</a>
        </div>
      ))}
      {items.length === 0 && <div className="text-sm text-gray-500">No invoices found.</div>}
    </div>
  );
}

