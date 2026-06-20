import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/LoginPage';
import Dashboard from './pages/AdminDashboard';
import Register from './pages/RegisterPage';
import LeadDetail from './pages/LeadDetail';
import PrivateRoutes from './utils/PrivateRoutes';
import { ContextProvider } from './services/ContextProvider';

function App() {
  return (
    <ContextProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/lead/:id" element={<LeadDetail />} />
        </Route>
      </Routes>
    </ContextProvider>
  );
}

export default App;
