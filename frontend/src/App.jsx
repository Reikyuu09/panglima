import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './utils/AuthContext';
import { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Footer from './components/Footer/Footer';
import LandingPage from './pages/LandingPage';
import About from './pages/About/About';
import Pricing from './pages/Harga/Pricing';
import Terms from './pages/SyaratKetentuan/Terms';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Parkir from './pages/Parkir/Parkir';
import Kendaraan from './pages/Kendaraan/Kendaraan';
import Pembayaran from './pages/Pembayaran/Pembayaran';
import Laporan from './pages/Laporan/Laporan';
import Petugas from './pages/KelolaPetugas/Petugas';  // ✅ Update path ini
import './App.css';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <main className="main-content">
        <button className="menu-toggle" onClick={toggleSidebar}>☰</button>
        <div className="content-wrapper">{children}</div>
        <Footer />
      </main>
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/tentang" element={<About />} />
      <Route path="/harga" element={<Pricing />} />
      <Route path="/syarat" element={<Terms />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      
      {/* Protected Routes */}
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
      <Route path="/petugas" element={
        <PrivateRoute>
          <Layout><Petugas /></Layout>
        </PrivateRoute>
      } />
      
      <Route path="*" element={<Navigate to="/" />} />
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