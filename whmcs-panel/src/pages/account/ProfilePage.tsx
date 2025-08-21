import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { createWhmcsFromEnv } from '../../lib/whmcs'

export default function ProfilePage() {
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | undefined>()
	const [success, setSuccess] = useState<string | undefined>()
	const [client, setClient] = useState<any>({})

	useEffect(() => {
		(async () => {
			try {
				const api = createWhmcsFromEnv()
				const res = await api.request<any>('GetClientsDetails', { stats: false })
				setClient(res.client)
			} catch (e: any) {
				setError(e.message)
			} finally {
				setLoading(false)
			}
		})()
	}, [])

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setError(undefined)
		setSuccess(undefined)
		try {
			const api = createWhmcsFromEnv()
			await api.request<any>('UpdateClient', client)
			setSuccess('Profile updated')
		} catch (e: any) {
			setError(e.message)
		} finally {
			setLoading(false)
		}
	}

	if (loading) return <div className="p-6">Loading…</div>
	if (error) return <div className="p-6 text-error">{error}</div>
	return (
		<div className="p-6 max-w-2xl mx-auto">
			<h2 className="text-xl font-semibold mb-4">My Profile</h2>
			<form onSubmit={onSubmit} className="grid grid-cols-1 gap-3">
				<input className="input input-bordered" placeholder="First name" value={client.firstname || ''} onChange={(e)=>setClient({ ...client, firstname: e.target.value })} />
				<input className="input input-bordered" placeholder="Last name" value={client.lastname || ''} onChange={(e)=>setClient({ ...client, lastname: e.target.value })} />
				<input className="input input-bordered" placeholder="Email" type="email" value={client.email || ''} onChange={(e)=>setClient({ ...client, email: e.target.value })} />
				<input className="input input-bordered" placeholder="Phone" value={client.phonenumber || ''} onChange={(e)=>setClient({ ...client, phonenumber: e.target.value })} />
				{success && <div className="text-success text-sm">{success}</div>}
				{error && <div className="text-error text-sm">{error}</div>}
				<button className="btn btn-primary">Save Changes</button>
			</form>
		</div>
	)
}