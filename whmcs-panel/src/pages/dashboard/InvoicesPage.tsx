import { useEffect, useState } from 'react'
import { createWhmcsFromEnv } from '../../lib/whmcs'
import { useAuthStore } from '../../store/auth'

export default function InvoicesPage() {
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | undefined>()
	const [invoices, setInvoices] = useState<any[]>([])
	const clientId = useAuthStore(s=>s.clientId)

	useEffect(() => {
		(async () => {
			try {
				const api = createWhmcsFromEnv()
				const res = await api.request<any>('GetInvoices', { userid: clientId })
				setInvoices(res.invoices?.invoice || [])
			} catch (e: any) {
				setError(e.message)
			} finally {
				setLoading(false)
			}
		})()
	}, [clientId])

	if (loading) return <div className="p-6">Loading…</div>
	if (error) return <div className="p-6 text-error">{error}</div>
	return (
		<div className="p-6">
			<h2 className="text-xl font-semibold mb-4">Invoices</h2>
			<div className="grid gap-3">
				{invoices.map((inv) => (
					<a key={inv.id} className="card bg-base-100 shadow hover:shadow-md transition" href={`${import.meta.env.VITE_WHMCS_BASE_URL}/viewinvoice.php?id=${inv.id}`} target="_blank">
						<div className="card-body">
							<div className="flex justify-between">
								<div>
									<div className="font-medium">Invoice #{inv.invoicenum || inv.id}</div>
									<div className="text-sm opacity-70">{inv.date} — Due {inv.duedate}</div>
								</div>
								<div className="text-right">
									<div className="font-medium">{inv.total} {inv.currencycode}</div>
									<div className="badge badge-outline">{inv.status}</div>
								</div>
							</div>
						</div>
					</a>
				))}
				{invoices.length === 0 && <div className="opacity-70">No invoices found.</div>}
			</div>
		</div>
	)
}