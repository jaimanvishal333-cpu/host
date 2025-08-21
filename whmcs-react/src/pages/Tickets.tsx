import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { whmcsApi } from '../lib/whmcsApi';
import { toast } from 'react-toastify';

export default function Tickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      if (!user) return;
      const res: any = await whmcsApi.getSupportTickets(user.clientId);
      setTickets(res.tickets?.ticket || []);
    }
    load();
  }, [user]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await whmcsApi.openTicket({ clientid: user.clientId, deptid: 1, subject, message });
      toast.success('Ticket created');
      setSubject('');
      setMessage('');
      const res: any = await whmcsApi.getSupportTickets(user.clientId);
      setTickets(res.tickets?.ticket || []);
    } catch (e: any) {
      toast.error(e?.message || 'Unable to open ticket');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h2 className="font-semibold mb-2">Your Tickets</h2>
        <div className="space-y-3">
          {tickets.map((t) => (
            <div key={t.id} className="rounded border border-gray-200 dark:border-gray-800 p-4">
              <div className="font-medium">[{t.status}] {t.subject}</div>
              <div className="text-sm text-gray-500">Ticket #{t.tid} • Dept {t.deptname}</div>
            </div>
          ))}
          {tickets.length === 0 && <div className="text-sm text-gray-500">No tickets found.</div>}
        </div>
      </div>
      <div>
        <h2 className="font-semibold mb-2">Open New Ticket</h2>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Subject</label>
            <input value={subject} onChange={(e)=>setSubject(e.target.value)} className="w-full rounded border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Message</label>
            <textarea value={message} onChange={(e)=>setMessage(e.target.value)} className="w-full rounded border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 h-32" />
          </div>
          <button disabled={loading} className="rounded bg-blue-600 text-white px-4 py-2 disabled:opacity-50">{loading? 'Submitting...':'Open Ticket'}</button>
        </form>
      </div>
    </div>
  );
}

