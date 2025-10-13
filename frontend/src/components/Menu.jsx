import Chats from "./Chats";
import CreateChatButton from "./CreateChatButton";
import { useMenuStore } from "../store/menuStore";
import CreateGroupForm from "./CreateGroupForm";
import { CiSearch } from "react-icons/ci";
import EditProfileForm from "./EditProfileForm";
import { useUserStore } from "../store/userStore";
import SearchChatsForm from "./SearchChatsForm";
import Aside from "./ui/Aside";
import DropDownMenuButton from "./ui/DropDownMenuButton";

const Menu = () => {
  const {
    isOpenCreateGroupForm,
    isOpenEditProfileForm,
    isOpenSearchChats,
    openSearchChats,
  } = useMenuStore();

  const { user } = useUserStore();

  if (isOpenCreateGroupForm) {
    return <CreateGroupForm />; // Si el formulario de creación de grupo está abierto, no mostrar el menú
  }

  if (isOpenEditProfileForm) {
    return <EditProfileForm />; // Si el formulario de edición de perfil está abierto, no mostrar el menú
  }

  if (isOpenSearchChats) {
    return <SearchChatsForm />; // Si el formulario de búsqueda de chats está abierto, no mostrar el menú
  }

  return (
    <Aside>
      <nav className="flex items-center gap-4 px-4 py-1">
        <DropDownMenuButton />

        <label className="input border-1 rounded-full">
          <CiSearch
            size={24}
          />
          <input
            disabled={!user}
            type="search"
            required
            placeholder="Buscar"
            onClick={openSearchChats}
          />
        </label>
      </nav>

      <div className="relative flex flex-1">
        <Chats />
      </div>

      <CreateChatButton />
    </Aside>
  );
};

export default Menu;
