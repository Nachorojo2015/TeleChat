import { FaPaperclip } from "react-icons/fa6";
import { FaArrowUp } from "react-icons/fa6";
import Messages from "../Messages";
import { useParams } from "react-router-dom";
import { SlOptionsVertical } from "react-icons/sl";
import { useEffect } from "react";
import { getGroup } from "../../services/groupsService";
import { useState } from "react";
import { sendMessage } from "../../services/messagesService";
import { useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { CiCircleInfo } from "react-icons/ci";
import { GoPaperclip } from "react-icons/go";
import { LuPencil } from "react-icons/lu";

import { io } from "socket.io-client";
import Members from "../Members";

const socket = io("http://localhost:3000", { withCredentials: true });

const Chatgroup = () => {
  const { id } = useParams();

  const [group, setGroup] = useState(null);

  const [message, setMessage] = useState("");

  const [isOpenInfo, setIsOpenInfo] = useState(false);

  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const inputMessage = useRef(null);

  useEffect(() => {
    const fetchGroup = async () => {
      const data = await getGroup(id);
      console.log("Group data:", data);
      setGroup(data);
    };

    fetchGroup();
  }, [id]);

  const openInfo = () => {
    setIsOpenInfo(true);
  };

  const closeInfo = () => {
    setIsOpenInfo(false);
  };

  const toggleDropDown = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  const handleMessage = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!message) return;

    const messageData = {
      chatId: id,
      replyId: "",
      content: message,
      type: "text",
      forwardedId: "",
    };

    try {
      const messageCreated = await sendMessage(messageData);
      setMessage("");
      inputMessage.current.value = "";
      socket.emit("receive-message", { message: messageCreated, chatId: id });
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    }
  };

  return (
    <section className="flex w-full">
      {/* Chat */}
      <div className="flex flex-col w-full">
        <header className="flex items-center gap-4 p-1 border-b px-6">
          <img
            src={group?.picture}
            alt="picture-of-group"
            className="w-12 h-12 rounded-full object-cover cursor-pointer"
            onClick={openInfo}
          />

          <div>
            <b>{group?.title}</b>
            <p>{group?.quantity_members} miembros</p>
          </div>

          <div className="ml-auto relative">
            <SlOptionsVertical
              className="cursor-pointer"
              onClick={toggleDropDown}
            />

            {isDropDownOpen && (
              <ul className="absolute right-0 top-12 bg-white border shadow-md rounded-md w-48 z-10">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Ver info. del grupo
                </li>
              </ul>
            )}
          </div>
        </header>

        <div className="relative flex flex-1">
          <ul className="overflow-y-auto overflow-x-hidden absolute h-full w-full px-4 py-2">
            <Messages chatId={id} />
          </ul>
        </div>

        <footer className="flex items-center gap-2 p-4 border-t">
          <FaPaperclip size={24} />
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            className="w-full bg-slate-50 p-1"
            onChange={handleMessage}
            ref={inputMessage}
          />
          <button
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
            onClick={handleSendMessage}
          >
            <FaArrowUp />
          </button>
        </footer>
      </div>

      {/* Info Chat */}
      {isOpenInfo ? (
        <div className="border-l flex flex-col h-screen w-[30%]">
          <header className="flex items-center gap-4 p-4 border-b flex-shrink-0">
            <IoMdClose
              size={24}
              onClick={closeInfo}
              className="cursor-pointer"
            />
            <b>Info. del grupo</b>

            {group?.role === "owner" && <LuPencil size={20} className="ml-auto"/>}
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

            <nav className="p-4 flex items-center">
              <ul className="flex gap-8 overflow-x-auto">
                <li>Miembros</li>
                <li>Imagenes</li>
                <li>Videos</li>
                <li>Documentos</li>
                <li>Audios</li>
              </ul>
            </nav>

            <section className="mt-2 px-4">
              <Members groupId={id} />
            </section>
          </div>
        </div>
      ) : (
        <></>
      )}
    </section>
  );
};

export default Chatgroup;
