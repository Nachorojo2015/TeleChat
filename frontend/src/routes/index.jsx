import { Routes, Route } from 'react-router-dom';
import Login from '../pages/login/Login.jsx';
import Register from '../pages/register/Register.jsx';
import HomeLayout from '../layout/HomeLayout.jsx';
import Chatgroup from '../components/chat/Chatgroup.jsx';
import ChatChannel from '../components/chat/ChatChannel.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      

      <Route path='/' element={<HomeLayout />}>
        <Route path='/g/:id' element={<Chatgroup />} />
        <Route path='/c/:id' element={<ChatChannel />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
