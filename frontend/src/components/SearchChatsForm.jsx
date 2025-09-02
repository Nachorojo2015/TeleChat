import { CiSearch } from "react-icons/ci";
import { FaArrowLeft } from "react-icons/fa6";
import { useMenuStore } from "../store/menuStore";

const SearchChatsForm = () => {

  const { closeSearchChats } = useMenuStore();

  return (
    <aside className="relative border-r border-slate-50 xl:w-[25%] w-full px-3">
      <div className="flex items-center gap-5 py-1">
        <button className="cursor-pointer" onClick={closeSearchChats}>
            <FaArrowLeft size={25} />
        </button>
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Buscar"
            className="w-full p-3 rounded-full indent-8 bg-slate-50"
            autoFocus
          />
          <CiSearch
            color="black"
            size={24}
            className="absolute top-1/2 left-3 transform -translate-y-1/2 text-slate-400"
          />
        </div>
      </div>
    </aside>
  );
};

export default SearchChatsForm;
