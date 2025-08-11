import { IoMdClose } from "react-icons/io";
import { CiCircleInfo } from "react-icons/ci";
import { GoPaperclip } from "react-icons/go";
import { FaFileAlt, FaUsers } from "react-icons/fa";
import { FaImages, FaMicrophone, FaVideo } from "react-icons/fa6";
import { useMenuStore } from "../store/menuStore";
import Members from "./Members";
import { LuPencil } from "react-icons/lu";

const InfoGroup = ({ group, id }) => {
  const { closeEditGroupForm, openEditGroupForm } = useMenuStore();

  return (
    <aside className="border-l flex flex-col h-screen w-[30%]">
      <header className="flex items-center gap-4 p-4 border-b">
        <IoMdClose
          size={24}
          onClick={closeEditGroupForm}
          className="cursor-pointer"
        />
        <b>Info. del grupo</b>

        {group?.role === "owner" && (
          <LuPencil size={20} className="ml-auto" onClick={openEditGroupForm} />
        )}
      </header>

      <div className="flex-1 overflow-y-auto">
        <picture className="relative">
          <img
            src={group?.picture}
            alt="Group"
            className="w-full max-h-96 object-cover"
          />

          <div className="absolute bottom-2 left-2 text-white">
            <b>{group?.title}</b>
            <p>{group?.quantity_members} miembros</p>
          </div>
        </picture>

        <article className="flex flex-col gap-2 p-4">
          <div className="flex items-center gap-2">
            <CiCircleInfo size={30} />
            <div>
              <p>{group?.description}</p>
              <span className="text-sm">Información</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <GoPaperclip size={30} />
            <div>
              <p className="truncate max-w-64">
                http://localhost:5173/join/{id}
              </p>
              <span className="text-sm">Link</span>
            </div>
          </div>
        </article>

        <nav className="p-4 flex items-center justify-center border-b border-t">
          <ul className="flex gap-8 overflow-x-auto">
            <li>
              <FaUsers size={24} />
            </li>
            <li>
              <FaImages size={24} />
            </li>
            <li>
              <FaVideo size={24} />
            </li>
            <li>
              <FaFileAlt size={24} />
            </li>
            <li>
              <FaMicrophone size={24} />
            </li>
          </ul>
        </nav>

        <section className="mt-2 px-4 py-3">
          <Members groupId={id} />
        </section>
      </div>
    </aside>
  );
};

export default InfoGroup;
