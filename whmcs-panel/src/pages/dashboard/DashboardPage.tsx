import { useEffect, useState } from 'react'
import { createWhmcsFromEnv } from '../../lib/whmcs'
import { useAuthStore } from '../../store/auth'

export default function DashboardPage() {
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | undefined>()
	const [client, setClient] = useState<any>()
	const clientId = useAuthStore(s=>s.clientId)
	const email = useAuthStore(s=>s.sessionUsername)

	useEffect(() => {
		(async () => {
			try {
				const api = createWhmcsFromEnv()
				const res = await api.request<any>('GetClientsDetails', { stats: true, clientid: clientId, email })
				setClient(res.client)
			} catch (e: any) {
				setError(e.message)
			} finally {
				setLoading(false)
			}
		})()
	}, [clientId, email])

	if (loading) return <div className="p-6">Loading…</div>
	if (error) return <div className="p-6 text-error">{error}</div>

	return (
		<div className="p-6 space-y-4">
			<h1 className="text-2xl font-semibold">Welcome{client?.firstname ? `, ${client.firstname}` : ''}</h1>
			<div className="grid md:grid-cols-3 gap-4">
				<div className="stat bg-base-100 shadow">
					<div className="stat-title">Services</div>
					<div className="stat-value">{client?.stats?.numactiveproducts ?? '-'}</div>
				</div>
				<div className="stat bg-base-100 shadow">
					<div className="stat-title">Invoices Due</div>
					<div className="stat-value">{client?.stats?.numunpaidinvoices ?? '-'}</div>
				</div>
				<div className="stat bg-base-100 shadow">
					<div className="stat-title">Tickets Open</div>
					<div className="stat-value">{client?.stats?.numactivetickets ?? '-'}</div>
				</div>
			</div>
		</div>
	)
}