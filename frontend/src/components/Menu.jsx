import { GiHamburgerMenu } from "react-icons/gi";
import Chats from "./Chats";
import CreateChatButton from "./CreateChatButton";
import { useMenuStore } from "../store/menuStore";
import CreateGroupForm from "./CreateGroupForm";
import CreateChannelForm from "./CreateChannelForm";
import { CiSearch } from "react-icons/ci";

const Menu = () => {
  const { isOpenCreateGroupForm, isOpenCreateChannelForm } = useMenuStore();

  if (isOpenCreateGroupForm) {
    return <CreateGroupForm />; // Si el formulario de creación de grupo está abierto, no mostrar el menú
  }

  if (isOpenCreateChannelForm) {
    return <CreateChannelForm />; // Si el formulario de creación de canal está abierto, no mostrar el menú
  }

  return (
    <aside className="relative border-r flex flex-col border-slate-50 w-[25%] group">
      <nav className="flex items-center gap-4 px-4 py-1">
        <GiHamburgerMenu className="text-2xl cursor-pointer" />

        <div className="relative w-full">
          <input
            type="text"
            placeholder="Buscar"
            className="w-full p-3 rounded-full indent-8 bg-slate-50"
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
