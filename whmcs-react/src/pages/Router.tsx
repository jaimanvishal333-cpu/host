import { Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import OTPVerify from './OTPVerify';
import Dashboard from './Dashboard';
import Services from './Services';
import Invoices from './Invoices';
import Tickets from './Tickets';
import Domains from './Domains';
import Products from './Products';
import Profile from './Profile';
import NotFound from './NotFound';

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/otp" element={<OTPVerify />} />

        <Route element={<ProtectedRoute />}>
          <Route index element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/services" element={<Services />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/domains" element={<Domains />} />
          <Route path="/products" element={<Products />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

