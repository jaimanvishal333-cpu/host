import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'

const AuthLayout = () => (
	<div className="min-h-screen flex items-center justify-center p-4">
		<div className="w-full max-w-md">
			<Outlet />
		</div>
		<Toaster position="top-right" />
	</div>
)

import Navbar from '../components/Navbar'

const AppLayout = () => {
	const init = useAuthStore((s)=>s.initFromCookies)
	useEffect(()=>{ init() }, [init])
	return (
		<div className="min-h-screen">
			<Navbar />
			<Outlet />
			<Toaster position="top-right" />
		</div>
	)
}

import type { ReactNode } from 'react'

const Protected = ({ children }: { children: ReactNode }) => {
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
	if (!isAuthenticated) return <Navigate to="/login" replace />
	return <>{children}</>
}

// Pages (lazy import or stubs)
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import ForgotPage from '../pages/auth/ForgotPage'
import OtpPage from '../pages/auth/OtpPage'
import DashboardPage from '../pages/dashboard/DashboardPage'
import ServicesPage from '../pages/dashboard/ServicesPage'
import InvoicesPage from '../pages/dashboard/InvoicesPage'
import TicketsPage from '../pages/dashboard/TicketsPage'
import DomainsPage from '../pages/dashboard/DomainsPage'
import ProductsPage from '../pages/products/ProductsPage'
import OrderPage from '../pages/order/OrderPage'
import ProfilePage from '../pages/account/ProfilePage'

export const router = createBrowserRouter([
	{
		path: '/',
		element: <AppLayout />,
		children: [
			{ index: true, element: <Navigate to="/dashboard" replace /> },
			{
				path: 'dashboard',
				element: (
					<Protected>
						<DashboardPage />
					</Protected>
				),
			},
			{ path: 'services', element: <Protected><ServicesPage /></Protected> },
			{ path: 'invoices', element: <Protected><InvoicesPage /></Protected> },
			{ path: 'tickets', element: <Protected><TicketsPage /></Protected> },
			{ path: 'domains', element: <Protected><DomainsPage /></Protected> },
			{ path: 'products', element: <ProductsPage /> },
			{ path: 'order', element: <Protected><OrderPage /></Protected> },
			{ path: 'account', element: <Protected><ProfilePage /></Protected> },
		],
	},
	{
		path: '/',
		element: <AuthLayout />,
		children: [
			{ path: 'login', element: <LoginPage /> },
			{ path: 'register', element: <RegisterPage /> },
			{ path: 'forgot', element: <ForgotPage /> },
			{ path: 'otp', element: <OtpPage /> },
		],
	},
])

export const AppRouter = () => <RouterProvider router={router} />