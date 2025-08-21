import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
import { useEffect, useState } from 'react'

export default function Navbar() {
	const navigate = useNavigate()
	const { isAuthenticated, logout } = useAuthStore()
	const [theme, setTheme] = useState<string>(() => localStorage.getItem('theme') || 'light')

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', theme)
		localStorage.setItem('theme', theme)
	}, [theme])

	return (
		<div className="navbar bg-base-100 shadow">
			<div className="container mx-auto">
				<div className="flex-1">
					<Link to="/" className="btn btn-ghost text-xl">WHMCS Panel</Link>
				</div>
				<div className="flex-none gap-2 items-center">
					<Link to="/products" className="btn btn-ghost">Plans</Link>
					{isAuthenticated && (
						<>
							<Link to="/services" className="btn btn-ghost">Services</Link>
							<Link to="/invoices" className="btn btn-ghost">Invoices</Link>
							<Link to="/tickets" className="btn btn-ghost">Tickets</Link>
							<Link to="/domains" className="btn btn-ghost">Domains</Link>
							<Link to="/account" className="btn btn-ghost">Account</Link>
						</>
					)}
					<select className="select select-bordered" value={theme} onChange={(e)=>setTheme(e.target.value)}>
						<option value="light">Light</option>
						<option value="dark">Dark</option>
					</select>
					{isAuthenticated ? (
						<button className="btn" onClick={()=>{ logout(); navigate('/login') }}>Logout</button>
					) : (
						<Link to="/login" className="btn">Login</Link>
					)}
				</div>
			</div>
		</div>
	)
}