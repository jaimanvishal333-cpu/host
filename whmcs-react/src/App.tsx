import { BrowserRouter } from 'react-router-dom';
import AppRouter from './pages/Router';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
        <ToastContainer position="top-right" autoClose={2500} closeOnClick />
      </AuthProvider>
    </BrowserRouter>
  );
}
