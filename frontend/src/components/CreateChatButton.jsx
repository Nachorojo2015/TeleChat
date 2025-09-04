import { useState } from "react";
import { LuPencil, LuUsers, LuMegaphone } from "react-icons/lu";
import { useMenuStore } from "../store/menuStore.js";
import { IoMdClose } from "react-icons/io";

const CreateChatButton = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { openCreateGroupForm } = useMenuStore();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCreateGroup = () => {
    openCreateGroupForm();
    setIsMenuOpen(false);
  };

  return (
    <div className={`absolute bottom-4 right-4 group-hover:block ${isMenuOpen ? "block" : "xl:hidden"}`}>
      {/* Menú desplegable */}
      {isMenuOpen && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-48 mb-2">
          <button
            onClick={handleCreateGroup}
            className="w-full cursor-pointer px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-3 text-gray-700"
          >
            <LuUsers className="text-blue-500" />
            <span>Crear Grupo</span>
          </button>
        </div>
      )}

      {/* Botón principal */}
      <button
        onClick={toggleMenu}
        className="rounded-full cursor-pointer bg-blue-500 text-white p-4 shadow-lg hover:bg-blue-600 transition-colors group-hover:block"
      >
        {isMenuOpen ? <IoMdClose size={25} /> : <LuPencil size={25} />}
      </button>
    </div>
  );
};

export default CreateChatButton;