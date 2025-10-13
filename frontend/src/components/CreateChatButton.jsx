import { LuPencil, LuUsers } from "react-icons/lu";
import { useMenuStore } from "../store/menuStore.js";
import { useUserStore } from "../store/userStore.js";

const CreateChatButton = () => {
  const { openCreateGroupForm } = useMenuStore();
  const { user } = useUserStore();

  const handleCreateGroup = () => {
    openCreateGroupForm();
  };

  return (
    <div className="dropdown dropdown-top dropdown-end ml-auto m-4">
      <div tabIndex={0} role="button" className="btn m-1">
        <LuPencil size={24} />
      </div>
      <ul
        tabIndex="-1"
        className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
      >
        <button
          disabled={!user}
          onClick={handleCreateGroup}
          className="w-full cursor-pointer px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-3 text-gray-700"
        >
          <LuUsers />
          <span>Crear Grupo</span>
        </button>
      </ul>
    </div>
  );
};

export default CreateChatButton;
