import type { FormEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { createWhmcsFromEnv } from '../../lib/whmcs'

export default function OrderPage() {
	const [params] = useSearchParams()
	const pid = useMemo(() => params.get('pid'), [params])
	const [domain, setDomain] = useState('')
	const [whois, setWhois] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | undefined>()
	const [success, setSuccess] = useState<string | undefined>()

	useEffect(() => { setError(undefined); setSuccess(undefined) }, [domain])

	const checkDomain = async () => {
		setLoading(true)
		setWhois(null)
		try {
			const api = createWhmcsFromEnv()
			const res = await api.request<any>('DomainWhois', { domain: domain })
			setWhois(res.whois || 'No WHOIS data')
		} catch (e: any) {
			setWhois('Lookup failed or not supported. You can continue ordering hosting without a domain.')
		} finally {
			setLoading(false)
		}
	}

	const placeOrder = async (e: FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setError(undefined)
		setSuccess(undefined)
		try {
			const api = createWhmcsFromEnv()
			const res = await api.request<any>('AddOrder', {
				pid,
				domain,
				paymentmethod: 'banktransfer',
			})
			if (res.result === 'success') {
				setSuccess('Order placed. Redirecting to invoice...')
				const invoiceId = res.invoiceid
				if (invoiceId) {
					window.location.href = `${import.meta.env.VITE_WHMCS_BASE_URL}/viewinvoice.php?id=${invoiceId}`
				}
			} else setError(res.message || 'Order failed')
		} catch (e: any) {
			setError(e.message || 'Order error')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="p-6 max-w-2xl mx-auto">
			<h2 className="text-xl font-semibold mb-4">Complete Order</h2>
			<form onSubmit={placeOrder} className="space-y-4">
				<input className="input input-bordered w-full" placeholder="Domain (optional)" value={domain} onChange={(e)=>setDomain(e.target.value)} />
				<div className="flex gap-2">
					<button type="button" className="btn" onClick={checkDomain} disabled={loading}>WHOIS Lookup</button>
					<button className="btn btn-primary" disabled={loading || !pid}>{loading ? 'Processing…' : 'Place Order'}</button>
				</div>
				{whois && <pre className="p-3 bg-base-200 rounded text-xs whitespace-pre-wrap">{whois}</pre>}
				{error && <div className="text-error text-sm">{error}</div>}
				{success && <div className="text-success text-sm">{success}</div>}
			</form>
		</div>
	)
}