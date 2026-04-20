import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SaleOrderModule from './pages/SaleOrderModule';
import SaleOrderReturn from './pages/SaleOrderReturn';
import DeliveryDashboard from './pages/DeliveryDashboard';
import InventoryDashboard from './pages/InventoryDashboard';
import ProductionOMS from './pages/ProductionOMS';
import UserControlDashboard from './pages/UserControlDashboard';
import SettingsDashboard from './pages/SettingsDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sale-orders" element={<SaleOrderModule />} />
        <Route path="/sale-order-return" element={<SaleOrderReturn />} />
        <Route path="/delivery-dashboard" element={<DeliveryDashboard />} />
        <Route path="/inventory" element={<InventoryDashboard />} />
        <Route path="/production-flow" element={<ProductionOMS />} />
        <Route path="/admin-setup" element={<UserControlDashboard />} />
        <Route path="/settings" element={<SettingsDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
