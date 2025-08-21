import { useEffect, useState } from 'react'
import { createWhmcsFromEnv } from '../../lib/whmcs'

export default function ProductsPage() {
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | undefined>()
	const [products, setProducts] = useState<any[]>([])

	useEffect(() => {
		(async () => {
			try {
				const api = createWhmcsFromEnv()
				const res = await api.request<any>('GetProducts')
				setProducts(res.products?.product || [])
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
			<h2 className="text-xl font-semibold mb-4">Hosting Plans</h2>
			<div className="grid md:grid-cols-3 gap-4">
				{products.map((p) => (
					<div key={p.pid} className="card bg-base-100 shadow">
						<div className="card-body">
							<h3 className="card-title">{p.name}</h3>
							<div className="text-3xl font-bold">{p.pricing?.USD?.monthly ? `$${p.pricing.USD.monthly}/mo` : 'Contact'}</div>
							<ul className="text-sm opacity-80 list-disc list-inside space-y-1">
								{p.configoptions?.configoption?.map((co: any) => (
									<li key={co.id}>{co.name}</li>
								))}
							</ul>
							<a href={`/order?pid=${p.pid}`} className="btn btn-primary">Order Now</a>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}