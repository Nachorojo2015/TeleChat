import { IoMdClose } from "react-icons/io";
import { CiCircleInfo } from "react-icons/ci";
import { GoPaperclip } from "react-icons/go";
import { useMenuStore } from "../store/menuStore";
import Members from "./Members";
import { LuPencil } from "react-icons/lu";
import ImageZoom from "./ImageZoom";

const InfoGroup = ({ group, id }) => {
  const { closeInfoGroup, openEditGroupForm } = useMenuStore();

  return (
    <aside className="shadow flex flex-col h-screen xl:w-[40%] w-full bg-white">
      <header className="flex items-center gap-4 p-4">
        <button onClick={closeInfoGroup} className="cursor-pointer">
          <IoMdClose size={24} />
        </button>
        <b className="text-xl">Info. del grupo</b>

        {group?.role === "owner" && (
          <button onClick={openEditGroupForm} className="ml-auto cursor-pointer">
            <LuPencil size={20} />
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto">
        <picture className="relative">
          <ImageZoom width={100} height={100} url={group?.picture} alt="Group" styles={'w-full max-h-96 object-cover'} />

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
              <p className="truncate max-w-52 text-blue-500 cursor-pointer">
                Copiar Link
              </p>
              <span className="text-sm">Link del grupo</span>
            </div>
          </div>
        </article>

        <hr />

        <section className="mt-2 px-4">
          <b>Members</b>
          <Members groupId={id} />
        </section>
      </div>
    </aside>
  );
};

export default InfoGroup;
