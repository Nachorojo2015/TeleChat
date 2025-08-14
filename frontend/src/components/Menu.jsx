import { GiHamburgerMenu } from "react-icons/gi";
import Chats from "./Chats";
import CreateChatButton from "./CreateChatButton";
import { useMenuStore } from "../store/menuStore";
import CreateGroupForm from "./CreateGroupForm";
import CreateChannelForm from "./CreateChannelForm";

const Menu = () => {

  const { isOpenCreateGroupForm, isOpenCreateChannelForm } = useMenuStore();

  if (isOpenCreateGroupForm) {
    return <CreateGroupForm />; // Si el formulario de creación de grupo está abierto, no mostrar el menú
  }

  if (isOpenCreateChannelForm) {
    return <CreateChannelForm />; // Si el formulario de creación de canal está abierto, no mostrar el menú
  }

  return (
    <aside className="relative border-r border-slate-50 w-[25%]">
        <nav className="flex items-center gap-4 px-4 py-1">
            <GiHamburgerMenu className="text-2xl cursor-pointer" />

            <input type="text" placeholder="Buscar" className="w-full p-1 rounded-full indent-3 bg-slate-50"/>
        </nav>

        <Chats />

        <CreateChatButton />
    </aside>
  )
}

export default Menu