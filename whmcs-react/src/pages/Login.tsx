import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Logged in');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required className="w-full rounded border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required className="w-full rounded border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" />
        </div>
        <button disabled={loading} className="w-full rounded bg-blue-600 text-white px-4 py-2 disabled:opacity-50">{loading? 'Logging in...':'Login'}</button>
        <div className="text-sm flex justify-between">
          <Link to="/forgot" className="text-blue-600 hover:underline">Forgot password?</Link>
          <Link to="/register" className="text-blue-600 hover:underline">Create account</Link>
        </div>
      </form>
    </div>
  );
}

