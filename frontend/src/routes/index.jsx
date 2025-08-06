import { Routes, Route } from 'react-router-dom';
import Login from '../pages/login/Login.jsx';
import Register from '../pages/register/Register.jsx';
import Dashboard from '../pages/index.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Dashboard />} />
    </Routes>
  );
};

export default AppRoutes;
