import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Login from './Login';
import Merchants from './pages/Merchants';
import MerchantDetail from './pages/MerchantDetail';
import Search from './pages/Search';
import Rewards from './pages/Rewards';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/merchants" element={<ProtectedRoute><Merchants /></ProtectedRoute>} />
        <Route path="/merchants/:id" element={<ProtectedRoute><MerchantDetail /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
        <Route path="/rewards" element={<ProtectedRoute><Rewards /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/merchants" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;