import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/auth'

export default function LoginPage() {
	const navigate = useNavigate()
	const { login, loading, error } = useAuthStore()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault()
		const ok = await login(email, password)
		if (ok) navigate('/dashboard')
	}

	return (
		<div className="card bg-base-100 shadow">
			<div className="card-body">
				<h2 className="card-title">Login</h2>
				<form onSubmit={onSubmit} className="space-y-4">
					<input className="input input-bordered w-full" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
					<input className="input input-bordered w-full" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
					{error && <div className="text-error text-sm">{error}</div>}
					<button className="btn btn-primary w-full" disabled={loading}>
						{loading ? 'Signing in…' : 'Sign In'}
					</button>
				</form>
				<div className="text-sm flex justify-between pt-2">
					<Link to="/register" className="link">Create account</Link>
					<Link to="/forgot" className="link">Forgot password?</Link>
				</div>
			</div>
		</div>
	)
}