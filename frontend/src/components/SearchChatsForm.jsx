import { CiSearch } from "react-icons/ci";
import { FaArrowLeft } from "react-icons/fa6";
import { useMenuStore } from "../store/menuStore";
import { useEffect, useState } from "react";
import { searchGroupsByName } from "../services/groupsService";
import ClipLoader from "react-spinners/ClipLoader";
import { Link, useNavigate } from "react-router-dom";
import { searchUsersByUsername } from "../services/userService";
import { createPrivateChat } from "../services/privateChatService";
import toast from "react-hot-toast";
import Aside from "./ui/Aside";

const SearchChatsForm = () => {
  const { closeSearchChats } = useMenuStore();

  const [valueSelected, setValueSelected] = useState("groups");

  const [searchTerm, setSearchTerm] = useState("");

  const [loader, setLoader] = useState(false);

  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!searchTerm || !valueSelected) return; // No buscar si está vacío

    const timeoutId = setTimeout(() => {
      // Aquí va tu función de búsqueda
      handleSearch(searchTerm, valueSelected);
    }, 500); // 500ms de espera

    return () => clearTimeout(timeoutId); // Limpia el timeout si el usuario sigue escribiendo
  }, [searchTerm, valueSelected]);

  const handleSearch = async (term, type) => {
    setLoader(true);

    if (type === "groups") {
      try {
        const groups = await searchGroupsByName(term);
        setGroups(groups);
      } catch {
        toast.error("Error al buscar grupos. Inténtalo de nuevo.");
      } finally {
        setLoader(false);
      }
    }

    if (type === "users") {
      try {
        const users = await searchUsersByUsername(term);
        setUsers(users);
      } catch {
        toast.error("Error al buscar usuarios. Inténtalo de nuevo.");
      } finally {
        setLoader(false);
      }
    }
  };

  const onCreatePrivateChat = async (privateUserId) => {
    try {
      const privateChatId = await createPrivateChat(privateUserId);
      navigate(`/p/${privateChatId}`);
      closeSearchChats();
    } catch {
      toast.error("Error al crear el chat privado");
    }
  };

  return (
    <Aside>
      <nav className="flex flex-col px-4">
        <div className="flex items-center gap-5 py-1">
          <button
            className="cursor-pointer transition-colors duration-300 hover:bg-slate-200 p-2 rounded-full"
            onClick={closeSearchChats}
          >
            <FaArrowLeft size={25} />
          </button>
          <label className="input border-1 rounded-full flex-1">
            <CiSearch size={24} />
            <input
              type="search"
              required
              placeholder={`${
                valueSelected === "groups"
                  ? "Buscar grupos públicos..."
                  : "Buscar usuarios..."
              }`}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </label>
        </div>

        <div className="flex items-center justify-around mt-5">
          <button
            onClick={() => setValueSelected("groups")}
            className={`cursor-pointer w-full transition hover:text-blue-500 ${
              valueSelected === "groups"
                ? "border-b border-blue-500 text-blue-500 font-bold"
                : ""
            }`}
          >
            Grupos
          </button>
          <button
            onClick={() => setValueSelected("users")}
            className={`cursor-pointer w-full transition hover:text-blue-500 ${
              valueSelected === "users"
                ? "border-b border-blue-500 text-blue-500 font-bold"
                : ""
            }`}
          >
            Usuarios
          </button>
        </div>
      </nav>

      <div className="relative flex flex-1">
        <ul className="overflow-y-auto p-3 overflow-x-hidden absolute h-full w-full">
          {loader && (
            <ClipLoader cssOverride={{ margin: "0 auto", display: "block" }} />
          )}

          {valueSelected === "groups" && groups.length === 0 && (
            <li className="p-2 text-center">No se encontraron grupos</li>
          )}

          {valueSelected === "users" && users.length === 0 && (
            <li className="p-2 text-center">No se encontraron usuarios</li>
          )}

          {valueSelected === "groups" &&
            groups.length > 0 &&
            groups.map((group) => (
              <Link
                to={`/g/${group.id}`}
                key={group.id}
                className={`flex p-2 mt-1 items-center gap-2 transition-colors rounded-lg`}
              >
                <img
                  src={group.picture}
                  alt={group.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="w-full">
                  <div className="flex flex-col">
                    <b className="break-words truncate max-w-[200px]">
                      {group.title}
                    </b>
                    <span className="text-sm text-slate-700">
                      {group.quantity_members > 1
                        ? `${group.quantity_members} miembros`
                        : `${group.quantity_members} miembro`}
                    </span>
                  </div>
                </div>
              </Link>
            ))}

          {valueSelected === "users" &&
            users.length > 0 &&
            users.map((user) => (
              <div
                key={user.id}
                className={`flex p-2 mt-1 items-center gap-2 transition-colors rounded-lg cursor-pointer`}
                onClick={() => onCreatePrivateChat(user.id)}
              >
                <img
                  src={user.profile_picture}
                  alt="user-picture"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="w-full">
                  <div className="flex flex-col">
                    <b className="break-words truncate max-w-[200px]">
                      {user.display_name}
                    </b>
                    <span className="text-sm text-slate-700">
                      @{user.username}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </ul>
      </div>
    </Aside>
  );
};

export default SearchChatsForm;
