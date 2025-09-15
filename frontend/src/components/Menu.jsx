import { GiHamburgerMenu } from "react-icons/gi";
import Chats from "./Chats";
import CreateChatButton from "./CreateChatButton";
import { useMenuStore } from "../store/menuStore";
import CreateGroupForm from "./CreateGroupForm";
import { CiSearch } from "react-icons/ci";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import EditProfileForm from "./EditProfileForm";
import { useUserStore } from "../store/userStore";
import SearchChatsForm from "./SearchChatsForm";
import { motion as Motion, AnimatePresence } from "framer-motion";
import CloseSessionButton from "./CloseSessionButton";

const Menu = () => {
  const {
    isOpenCreateGroupForm,
    isOpenEditProfileForm,
    openEditProfileForm,
    isOpenSearchChats,
    openSearchChats,
  } = useMenuStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user } = useUserStore();

  const location = useLocation();
  const chatId = location.pathname.split("/").pop();

 

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
    <aside
      className={`relative border-r flex flex-col border-slate-50 xl:w-[25%] xl:flex w-full ${
        chatId ? "hidden" : "flex"
      } group`}
    >
      <nav className="flex items-center gap-4 px-4 py-1">
        <div className="relative">
          <button
            className={`cursor-pointer transition-colors duration-300 hover:bg-slate-200 ${
              isDropdownOpen ? "bg-slate-200" : ""
            } p-2 rounded-full`}
            onClick={() => setIsDropdownOpen((prev) => !prev)}
          >
            <GiHamburgerMenu size={25} />
          </button>

          <AnimatePresence>
            {isDropdownOpen && user && (
              <Motion.div
                key="dropdown"
                initial={{ opacity: 0, y: -10 }} // estado inicial
                animate={{ opacity: 1, y: 0 }} // animación de entrada
                exit={{ opacity: 0, y: -10 }} // animación de salida
                transition={{ duration: 0.2 }} // velocidad
                className="absolute left-0 top-full mt-5 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-72 z-20"
              >
                <button
                  className="w-full flex items-center gap-4 px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={openEditProfileForm}
                >
                  <img
                    src={user?.profile_picture}
                    className="w-8 h-8 rounded-full object-cover"
                    alt="profile-picture"
                  />
                  <span>{user?.display_name}</span>
                </button>
                <CloseSessionButton />
              </Motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative w-full">
          <input
            disabled={!user}
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
