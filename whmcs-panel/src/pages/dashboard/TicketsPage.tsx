import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { createWhmcsFromEnv } from '../../lib/whmcs'

export default function TicketsPage() {
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | undefined>()
	const [tickets, setTickets] = useState<any[]>([])
	const [open, setOpen] = useState(false)
	const [form, setForm] = useState({ subject: '', message: '', deptid: 1, priority: 'Low' })

	const fetchTickets = async () => {
		try {
			const api = createWhmcsFromEnv()
			const res = await api.request<any>('GetSupportTickets')
			setTickets(res.tickets?.ticket || [])
		} catch (e: any) {
			setError(e.message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => { fetchTickets() }, [])

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault()
		try {
			const api = createWhmcsFromEnv()
			await api.request<any>('OpenTicket', form)
			setOpen(false)
			setForm({ subject: '', message: '', deptid: 1, priority: 'Low' })
			setLoading(true)
			await fetchTickets()
		} catch (e: any) {
			setError(e.message)
		}
	}

	if (loading) return <div className="p-6">Loading…</div>
	if (error) return <div className="p-6 text-error">{error}</div>
	return (
		<div className="p-6 space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-semibold">Support Tickets</h2>
				<button className="btn btn-primary" onClick={()=>setOpen(true)}>Open Ticket</button>
			</div>
			<div className="grid gap-3">
				{tickets.map((t) => (
					<div key={t.id} className="card bg-base-100 shadow">
						<div className="card-body">
							<div className="flex justify-between">
								<div>
									<div className="font-medium">#{t.tid} {t.subject}</div>
									<div className="text-sm opacity-70">{t.date} • {t.status} • {t.department}</div>
								</div>
								<div className="badge badge-outline">{t.priority}</div>
							</div>
						</div>
					</div>
				))}
				{tickets.length === 0 && <div className="opacity-70">No tickets found.</div>}
			</div>

			{open && (
				<div className="modal modal-open">
					<div className="modal-box">
						<h3 className="font-semibold mb-3">Open Support Ticket</h3>
						<form onSubmit={onSubmit} className="space-y-3">
							<input className="input input-bordered w-full" placeholder="Subject" value={form.subject} onChange={(e)=>setForm({...form, subject:e.target.value})} required />
							<select className="select select-bordered w-full" value={form.priority} onChange={(e)=>setForm({...form, priority:e.target.value})}>
								<option>Low</option>
								<option>Medium</option>
								<option>High</option>
							</select>
							<textarea className="textarea textarea-bordered w-full" placeholder="Message" value={form.message} onChange={(e)=>setForm({...form, message:e.target.value})} required />
							<div className="modal-action">
								<button type="button" className="btn" onClick={()=>setOpen(false)}>Cancel</button>
								<button className="btn btn-primary">Submit</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	)
}