import { useState } from "react";
import { LuPencil, LuUsers, LuMegaphone } from "react-icons/lu";
import { useMenuStore } from "../store/menuStore.js";

const CreateChatButton = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { openCreateGroupForm, openCreateChannelForm } = useMenuStore();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCreateGroup = () => {
    openCreateGroupForm();
    setIsMenuOpen(false);
  };

  const handleCreateChannel = () => {
    openCreateChannelForm();
    setIsMenuOpen(false);
  };

  return (
    <div className="absolute bottom-4 right-4">
      {/* Menú desplegable */}
      {isMenuOpen && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-48 mb-2">
          <button
            onClick={handleCreateGroup}
            className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-3 text-gray-700"
          >
            <LuUsers className="text-blue-500" />
            <span>Crear Grupo</span>
          </button>
          
          <button
            onClick={handleCreateChannel}
            className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-3 text-gray-700"
          >
            <LuMegaphone className="text-green-500" />
            <span>Crear Canal</span>
          </button>
        </div>
      )}

      {/* Botón principal */}
      <button
        onClick={toggleMenu}
        className="rounded-full bg-blue-500 text-white p-4 shadow-lg hover:bg-blue-600 transition-colors"
      >
        <LuPencil size={25} />
      </button>
    </div>
  );
};

export default CreateChatButton;