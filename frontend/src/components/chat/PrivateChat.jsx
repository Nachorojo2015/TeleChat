import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPrivateChat } from "../../services/privateChatService";
import { FaArrowLeft, FaTrash } from "react-icons/fa6";
import { formatLastSessionTime } from "../../utils/formatLastSessionTime";
import { SlOptionsVertical } from "react-icons/sl";
import { CiCircleInfo } from "react-icons/ci";
import Messages from "../Messages";
import MediaUploadButton from "../MediaUploadButton";
import MessageInput from "../MessageInput";
import { useMenuStore } from "../../store/menuStore";
import InfoPrivateChat from "../InfoPrivateChat";

const PrivateChat = () => {
  const { id } = useParams();

  const [privateChat, setPrivateChat] = useState(null);

  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const { isOpenInfoPrivateChat, openInfoPrivateChat } = useMenuStore();

  const toggleDropDown = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  useEffect(() => {
    const fetchPrivateChat = async () => {
      try {
        const data = await getPrivateChat(id);
        console.log("Private chat data:", data);
        setPrivateChat(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPrivateChat();
  }, [id]);

  return (
    <>
      <div className={`xl:flex flex-col w-full ${
          isOpenInfoPrivateChat ? "hidden" : "flex"
        }`}>
        <header className="flex items-center gap-4 p-1 px-3 bg-white shadow">
          <Link to={"/"}>
            <FaArrowLeft />
          </Link>

          <img
            src={privateChat?.profile_picture}
            alt="picture-of-group"
            className="w-12 h-12 rounded-full object-cover cursor-pointer"
          />

          <div>
            <b>{privateChat?.display_name}</b>
            <p>{formatLastSessionTime(privateChat?.last_active)}</p>
          </div>

          <div className="ml-auto relative">
            <SlOptionsVertical
              className="cursor-pointer"
              onClick={toggleDropDown}
            />

            {isDropDownOpen && (
              <ul className="absolute right-0 top-12 bg-white shadow-md rounded-md w-48 z-10">
                <li className="px-4 py-2 hover:bg-gray-100 rounded-md">
                  <button className="flex w-full items-center gap-6 cursor-pointer" onClick={openInfoPrivateChat}>
                    <CiCircleInfo size={20} />
                    <span>Ver info</span>
                  </button>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 rounded-md text-red-500">
                  <button className="flex w-full items-center gap-6 cursor-pointer">
                    <FaTrash size={20} />
                    <span>Eliminar chat</span>
                  </button>
                </li>
              </ul>
            )}
          </div>
        </header>

        <div className="relative flex flex-1">
          <ul className="overflow-y-auto overflow-x-hidden absolute h-full w-full px-4 py-2 scrollbar-transparent">
            <Messages chatId={id} typeChat="private" />
          </ul>
        </div>

        <footer className="flex items-center justify-center gap-2 p-2 shadow bg-white">
          <MediaUploadButton id={id} />
          <MessageInput id={id} />
        </footer>
      </div>

       {/* Info Private chat */}
       {isOpenInfoPrivateChat && <InfoPrivateChat privateChat={privateChat} />}
    </>
  );
};

export default PrivateChat;
