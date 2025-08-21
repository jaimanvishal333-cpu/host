import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-full bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold">WHMCS Client Panel</Link>
          <nav className="flex items-center gap-4 text-sm">
            {user && (
              <>
                <NavLink to="/dashboard" className={({isActive})=>isActive? 'text-blue-600':'hover:text-blue-500'}>Dashboard</NavLink>
                <NavLink to="/products" className={({isActive})=>isActive? 'text-blue-600':'hover:text-blue-500'}>Hosting</NavLink>
                <NavLink to="/invoices" className={({isActive})=>isActive? 'text-blue-600':'hover:text-blue-500'}>Invoices</NavLink>
                <NavLink to="/tickets" className={({isActive})=>isActive? 'text-blue-600':'hover:text-blue-500'}>Tickets</NavLink>
                <NavLink to="/profile" className={({isActive})=>isActive? 'text-blue-600':'hover:text-blue-500'}>Profile</NavLink>
                <button onClick={logout} className="ml-2 rounded bg-gray-800 text-white px-3 py-1 text-xs hover:bg-gray-700">Logout</button>
              </>
            )}
            {!user && (
              <>
                <NavLink to="/login" className={({isActive})=>isActive? 'text-blue-600':'hover:text-blue-500'}>Login</NavLink>
                <NavLink to="/register" className={({isActive})=>isActive? 'text-blue-600':'hover:text-blue-500'}>Register</NavLink>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
      <footer className="border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 py-6">© {new Date().getFullYear()} WHMCS Client Panel</div>
      </footer>
    </div>
  );
}

