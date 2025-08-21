import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function OtpPage() {
	const navigate = useNavigate()
	const [code, setCode] = useState('')
	const [error, setError] = useState<string | undefined>()

	const onSubmit = (e: FormEvent) => {
		e.preventDefault()
		const expected = sessionStorage.getItem('otp')
		if (expected && code === expected) {
			sessionStorage.removeItem('otp')
			navigate('/login')
		} else {
			setError('Invalid code')
		}
	}

	return (
		<div className="card bg-base-100 shadow">
			<div className="card-body">
				<h2 className="card-title">Enter OTP</h2>
				<form onSubmit={onSubmit} className="space-y-4">
					<input className="input input-bordered w-full" placeholder="6-digit code" value={code} onChange={(e)=>setCode(e.target.value)} required />
					{error && <div className="text-error text-sm">{error}</div>}
					<button className="btn btn-primary w-full">Verify</button>
				</form>
			</div>
		</div>
	)
}