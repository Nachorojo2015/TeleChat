import { IoMdClose } from "react-icons/io";
import { useMenuStore } from "../store/menuStore";
import { formatLastSessionTime } from "../utils/formatLastSessionTime";
import { PiUserCircleBold } from "react-icons/pi";
import { FiBook } from "react-icons/fi";

const InfoPrivateChat = ({ privateChat }) => {
  console.log(privateChat)
  const { closeInfoPrivateChat } = useMenuStore();

  return (
    <aside className="shadow flex flex-col h-screen xl:w-[40%] w-full bg-white">
      <header className="flex items-center gap-4 p-4">
        <button onClick={closeInfoPrivateChat} className="cursor-pointer">
          <IoMdClose size={24} />
        </button>
        <b>Info. del usuario</b>
      </header>

      <div className="flex-1 overflow-y-auto">
        <picture className="relative">
          <img
            src={privateChat?.profile_picture}
            alt="private-chat"
            className="w-full max-h-96 object-cover"
            style={{ filter: "brightness(90%)" }}
          />

          <div className="absolute bottom-2 left-2 text-white">
            <b>{privateChat?.display_name}</b>
            <p>{formatLastSessionTime(privateChat?.last_active)}</p>
          </div>
        </picture>

        <article className="flex flex-col gap-2 p-4">
          <div className="flex items-center gap-2">
            <PiUserCircleBold size={30} />
            <div>
              <p>@{privateChat?.username}</p>
              <span className="text-sm">Nombre del usuario</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FiBook size={30} />
            <div>
              <p className="truncate max-w-52">
                {privateChat?.bio}
              </p>
              <span className="text-sm">Bio.</span>
            </div>
          </div>
        </article>
      </div>
    </aside>
  );
};

export default InfoPrivateChat;
