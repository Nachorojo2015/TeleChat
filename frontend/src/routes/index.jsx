import { Routes, Route } from 'react-router-dom';
import Login from '../pages/login/Login.jsx';
import Register from '../pages/register/Register.jsx';
import HomeLayout from '../layout/HomeLayout.jsx';
import Chatgroup from '../components/chat/Chatgroup.jsx';
import PrivateChat from '../components/chat/PrivateChat.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      

      <Route path='/' element={<HomeLayout />}>
        <Route path='/g/:id' element={<Chatgroup />} />
        <Route path='/p/:id' element={<PrivateChat />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
