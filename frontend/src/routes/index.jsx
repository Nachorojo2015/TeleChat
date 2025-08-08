import { Routes, Route } from 'react-router-dom';
import Login from '../pages/login/Login.jsx';
import Register from '../pages/register/Register.jsx';
import HomeLayout from '../layout/HomeLayout.jsx';
import Chatgroup from '../components/chat/Chatgroup.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      

      <Route path='/' element={<HomeLayout />}>
        <Route path='/g/:id' element={<Chatgroup />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
