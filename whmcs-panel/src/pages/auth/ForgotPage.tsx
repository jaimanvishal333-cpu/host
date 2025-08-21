import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createWhmcsFromEnv } from '../../lib/whmcs'

export default function ForgotPage() {
	const navigate = useNavigate()
	const [email, setEmail] = useState('')
	const [loading, setLoading] = useState(false)
	const [message, setMessage] = useState<string | undefined>()
	const [error, setError] = useState<string | undefined>()

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setMessage(undefined)
		setError(undefined)
		try {
			const api = createWhmcsFromEnv()
			const res = await api.request<any>('SendEmail', {
				messagename: 'Password Reset Verification',
				recipient: email,
			})
			if (res.result === 'success') {
				const otp = String(Math.floor(100000 + Math.random() * 900000))
				sessionStorage.setItem('otp', otp)
				setMessage('If the email exists, a message has been sent.')
				navigate('/otp')
			} else setError(res.message || 'Could not send email')
		} catch (e: any) {
			setError(e.message || 'Error sending email')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="card bg-base-100 shadow">
			<div className="card-body">
				<h2 className="card-title">Forgot password</h2>
				<form onSubmit={onSubmit} className="space-y-4">
					<input className="input input-bordered w-full" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
					{message && <div className="text-success text-sm">{message}</div>}
					{error && <div className="text-error text-sm">{error}</div>}
					<button className="btn btn-primary w-full" disabled={loading}>{loading ? 'Sending…' : 'Send email'}</button>
				</form>
				<p className="text-sm pt-2"><Link className="link" to="/login">Back to login</Link></p>
			</div>
		</div>
	)
}