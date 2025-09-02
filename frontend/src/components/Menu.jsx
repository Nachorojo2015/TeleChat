import { GiHamburgerMenu } from "react-icons/gi";
import Chats from "./Chats";
import CreateChatButton from "./CreateChatButton";
import { useMenuStore } from "../store/menuStore";
import CreateGroupForm from "./CreateGroupForm";
import { CiSearch } from "react-icons/ci";
import { useState } from "react";
import { CiLogout } from "react-icons/ci";
import { logout } from "../services/auth/authService";
import { useLocation, useNavigate } from "react-router-dom";
import EditProfileForm from "./EditProfileForm";
import { useUserStore } from "../store/userStore";
import SearchChatsForm from "./SearchChatsForm";

const Menu = () => {
  const { isOpenCreateGroupForm, isOpenEditProfileForm, openEditProfileForm, isOpenSearchChats, openSearchChats } = useMenuStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user } = useUserStore();
  const navigate = useNavigate();

  const location = useLocation();
  const chatId = location.pathname.split('/').pop();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isOpenCreateGroupForm) {
    return <CreateGroupForm />; // Si el formulario de creación de grupo está abierto, no mostrar el menú
  }

  if (isOpenEditProfileForm) {
    return <EditProfileForm />; // Si el formulario de edición de perfil está abierto, no mostrar el menú
  }

  if (isOpenSearchChats) {
    return <SearchChatsForm />;
  }

  return (
    <aside className={`relative border-r flex flex-col border-slate-50 xl:w-[25%] xl:flex w-full ${chatId ? 'hidden' : 'flex'} group`}>
      <nav className="flex items-center gap-4 px-4 py-1">
        <div className="relative">
          <button
            className="cursor-pointer"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
          >
            <GiHamburgerMenu size={25} />
          </button>
          {isDropdownOpen && (
            <div className="absolute left-0 top-full mt-5 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-72 z-20">
              <button className="w-full flex items-center gap-4 px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={openEditProfileForm}>
                <img src={user?.profile_picture} className="w-8 h-8 rounded-full object-cover" alt="profile-picture" />
                <span>{user?.display_name}</span>
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 text-red-500" onClick={handleLogout}>
                <CiLogout size={20} />
                <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>

        <div className="relative w-full">
          <input
            type="text"
            placeholder="Buscar"
            className="w-full p-3 rounded-full indent-8 bg-slate-50"
            onClick={openSearchChats}
          />
          <CiSearch
            color="black"
            size={24}
            className="absolute top-1/2 left-3 transform -translate-y-1/2 text-slate-400"
          />
        </div>
      </nav>

      <div className="relative flex flex-1">
        <Chats />
      </div>

      <CreateChatButton />
    </aside>
  );
};

export default Menu;
