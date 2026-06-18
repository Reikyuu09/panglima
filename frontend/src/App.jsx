import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './utils/AuthContext';
import Navbar from './components/Sidebar/Sidebar';
import Footer from './components/Footer/Footer';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Parkir from './pages/Parkir/Parkir';
import Kendaraan from './pages/Kendaraan/Kendaraan';
import Pembayaran from './pages/Pembayaran/Pembayaran';
import Laporan from './pages/Laporan/Laporan';
import './App.css';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1, background: 'var(--bg, #f0f2ff)' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Layout><Dashboard /></Layout>
        </PrivateRoute>
      } />
      <Route path="/parkir" element={
        <PrivateRoute>
          <Layout><Parkir /></Layout>
        </PrivateRoute>
      } />
      <Route path="/kendaraan" element={
        <PrivateRoute>
          <Layout><Kendaraan /></Layout>
        </PrivateRoute>
      } />
      <Route path="/pembayaran" element={
        <PrivateRoute>
          <Layout><Pembayaran /></Layout>
        </PrivateRoute>
      } />
      <Route path="/laporan" element={
        <PrivateRoute>
          <Layout><Laporan /></Layout>
        </PrivateRoute>
      } />
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
