import { useEffect, useState } from 'react'
import { createWhmcsFromEnv } from '../../lib/whmcs'

export default function DomainsPage() {
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | undefined>()
	const [domains, setDomains] = useState<any[]>([])

	useEffect(() => {
		(async () => {
			try {
				const api = createWhmcsFromEnv()
				const res = await api.request<any>('GetClientsDomains')
				setDomains(res.domains?.domain || [])
			} catch (e: any) {
				setError(e.message)
			} finally {
				setLoading(false)
			}
		})()
	}, [])

	if (loading) return <div className="p-6">Loading…</div>
	if (error) return <div className="p-6 text-error">{error}</div>

	return (
		<div className="p-6">
			<h2 className="text-xl font-semibold mb-4">My Domains</h2>
			<div className="grid gap-3">
				{domains.map((d) => (
					<div key={d.id} className="card bg-base-100 shadow">
						<div className="card-body">
							<div className="flex justify-between">
								<div>
									<div className="font-medium">{d.domainname}</div>
									<div className="text-sm opacity-70">Reg: {d.regdate} • Exp: {d.nextduedate}</div>
								</div>
								<div className="badge badge-outline">{d.status}</div>
							</div>
						</div>
					</div>
				))}
				{domains.length === 0 && <div className="opacity-70">No domains found.</div>}
			</div>
		</div>
	)
}