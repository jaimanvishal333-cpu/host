import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createWhmcsFromEnv } from '../../lib/whmcs'

export default function RegisterPage() {
	const navigate = useNavigate()
	const [form, setForm] = useState({
		firstname: '',
		lastname: '',
		email: '',
		password2: '',
		address1: '',
		city: '',
		state: '',
		postcode: '',
		country: 'US',
		phonenumber: '',
	})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | undefined>()

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setError(undefined)
		try {
			const api = createWhmcsFromEnv()
			const res = await api.request<any>('AddClient', form)
			if (res.result === 'success') navigate('/login')
			else setError(res.message || 'Registration failed')
		} catch (e: any) {
			setError(e.message || 'Registration error')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="card bg-base-100 shadow">
			<div className="card-body">
				<h2 className="card-title">Create account</h2>
				<form onSubmit={onSubmit} className="grid grid-cols-1 gap-3">
					<input className="input input-bordered" placeholder="First name" value={form.firstname} onChange={(e)=>setForm({...form, firstname:e.target.value})} required />
					<input className="input input-bordered" placeholder="Last name" value={form.lastname} onChange={(e)=>setForm({...form, lastname:e.target.value})} required />
					<input className="input input-bordered" placeholder="Email" type="email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} required />
					<input className="input input-bordered" placeholder="Password" type="password" value={form.password2} onChange={(e)=>setForm({...form, password2:e.target.value})} required />
					<input className="input input-bordered" placeholder="Address" value={form.address1} onChange={(e)=>setForm({...form, address1:e.target.value})} />
					<div className="grid grid-cols-2 gap-2">
						<input className="input input-bordered" placeholder="City" value={form.city} onChange={(e)=>setForm({...form, city:e.target.value})} />
						<input className="input input-bordered" placeholder="State" value={form.state} onChange={(e)=>setForm({...form, state:e.target.value})} />
					</div>
					<div className="grid grid-cols-2 gap-2">
						<input className="input input-bordered" placeholder="Postcode" value={form.postcode} onChange={(e)=>setForm({...form, postcode:e.target.value})} />
						<input className="input input-bordered" placeholder="Country Code (US)" value={form.country} onChange={(e)=>setForm({...form, country:e.target.value})} />
					</div>
					<input className="input input-bordered" placeholder="Phone" value={form.phonenumber} onChange={(e)=>setForm({...form, phonenumber:e.target.value})} />
					{error && <div className="text-error text-sm">{error}</div>}
					<button className="btn btn-primary" disabled={loading}>{loading ? 'Creating…' : 'Create account'}</button>
				</form>
				<p className="text-sm pt-2">Already have an account? <Link to="/login" className="link">Login</Link></p>
			</div>
		</div>
	)
}