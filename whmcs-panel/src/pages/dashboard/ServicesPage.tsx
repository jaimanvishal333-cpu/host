import { useEffect, useState } from 'react'
import { createWhmcsFromEnv } from '../../lib/whmcs'
import { useAuthStore } from '../../store/auth'

export default function ServicesPage() {
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | undefined>()
	const [services, setServices] = useState<any[]>([])
	const clientId = useAuthStore(s=>s.clientId)

	useEffect(() => {
		(async () => {
			try {
				const api = createWhmcsFromEnv()
				const res = await api.request<any>('GetClientsProducts', { clientid: clientId })
				setServices(res.products?.product || [])
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
			<h2 className="text-xl font-semibold mb-4">My Services</h2>
			<div className="grid gap-3">
				{services.map((s) => (
					<div key={s.id} className="card bg-base-100 shadow">
						<div className="card-body">
							<div className="font-medium">{s.name} — {s.status}</div>
							<div className="text-sm opacity-80">{s.domain || s.dedicatedip || ''}</div>
						</div>
					</div>
				))}
				{services.length === 0 && <div className="opacity-70">No services found.</div>}
			</div>
		</div>
	)
}