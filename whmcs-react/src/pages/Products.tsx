import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { whmcsApi } from '../lib/whmcsApi';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Products() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [domain, setDomain] = useState('');
  const [selectedPid, setSelectedPid] = useState<number | null>(null);
  const [checkingDomain, setCheckingDomain] = useState(false);
  const [ordering, setOrdering] = useState(false);
  const [whois, setWhois] = useState<any | null>(null);

  useEffect(() => {
    async function load() {
      const res: any = await whmcsApi.getProducts();
      const list = res.products?.product || [];
      setProducts(list);
    }
    load();
  }, []);

  async function checkDomain(e: FormEvent) {
    e.preventDefault();
    setCheckingDomain(true);
    try {
      const res: any = await whmcsApi.domainWhois(domain);
      setWhois(res);
    } catch (e: any) {
      toast.error(e?.message || 'Domain check failed');
    } finally {
      setCheckingDomain(false);
    }
  }

  async function order() {
    if (!user || !selectedPid) return;
    setOrdering(true);
    try {
      const res: any = await whmcsApi.addOrder({
        clientid: user.clientId,
        pid: selectedPid,
        domain: domain || undefined,
        paymentmethod: 'banktransfer',
        noemail: true,
      });
      toast.success(`Order placed. Invoice #${res.orderid}`);
    } catch (e: any) {
      toast.error(e?.message || 'Order failed');
    } finally {
      setOrdering(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Hosting Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.pid} className={`rounded border p-4 ${selectedPid===p.pid? 'border-blue-500':'border-gray-200 dark:border-gray-800'}`}>
            <div className="font-semibold">{p.name}</div>
            <div className="text-sm text-gray-500 mb-2">{p.description || '—'}</div>
            {p.pricing?.USD && (
              <div className="text-lg">${p.pricing.USD.monthly}/mo</div>
            )}
            <button onClick={()=>setSelectedPid(p.pid)} className="mt-3 rounded bg-blue-600 text-white px-3 py-1 text-sm">Select</button>
          </div>
        ))}
      </div>
      <form onSubmit={checkDomain} className="rounded border border-gray-200 dark:border-gray-800 p-4">
        <div className="font-semibold mb-2">Domain Search</div>
        <div className="flex gap-2">
          <input value={domain} onChange={(e)=>setDomain(e.target.value)} placeholder="example.com" className="flex-1 rounded border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" />
          <button disabled={checkingDomain} className="rounded bg-gray-800 text-white px-3 py-2 text-sm disabled:opacity-50">{checkingDomain? 'Checking...':'Check'}</button>
        </div>
        {whois && (
          <div className="text-sm text-gray-500 mt-2">{JSON.stringify(whois)}</div>
        )}
      </form>
      <div>
        <button disabled={!selectedPid || ordering} onClick={order} className="rounded bg-green-600 text-white px-4 py-2 disabled:opacity-50">{ordering? 'Placing order...':'Place Order'}</button>
      </div>
    </div>
  );
}

