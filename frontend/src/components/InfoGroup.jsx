import { IoMdClose } from "react-icons/io";
import { CiCircleInfo } from "react-icons/ci";
import { GoPaperclip } from "react-icons/go";
import { useMenuStore } from "../store/menuStore";
import Members from "./Members";
import { LuPencil } from "react-icons/lu";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const InfoGroup = ({ group, id }) => {
  const { closeInfoGroup, openEditGroupForm } = useMenuStore();

  return (
    <aside className="shadow flex flex-col h-screen xl:w-[40%] w-full bg-white">
      <header className="flex items-center gap-4 p-4">
        <button onClick={closeInfoGroup} className="cursor-pointer">
          <IoMdClose size={24} />
        </button>
        <b>Info. del grupo</b>

        {group?.role === "owner" && (
          <button onClick={openEditGroupForm} className="ml-auto cursor-pointer">
            <LuPencil size={20} />
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto">
        <picture className="relative">
          <Zoom>
            <img
              src={group?.picture}
              alt="Group"
              className="w-full max-h-96 object-cover"
              style={{ filter: "brightness(90%)" }}
            />
          </Zoom>

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
              <p className="truncate max-w-52">
                http://localhost:5173/join/{id}
              </p>
              <span className="text-sm">Link</span>
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
