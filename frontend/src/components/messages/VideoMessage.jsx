import { useState } from "react";
import { useUserStore } from "../../store/userStore";
import { formatTimestampToHHMM } from "../../utils/formatTimestampToHHMM";
import { IoMdClose } from "react-icons/io";
import { FiTrash } from "react-icons/fi";
import { socket } from "../../socket/socket";
import { deleteMessage } from "../../services/messagesService";
import { motion as Motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const onDeleteMessage = async (messageId) => {
  try {
    await deleteMessage(messageId);
    socket.emit("delete-message", { messageId });
  } catch {
    toast.error("Error al eliminar el mensaje. Inténtalo de nuevo.");
  }
};

const VideoMessage = ({ messageData, typeChat }) => {
  const { user } = useUserStore();

  const [showMenu, setShowMenu] = useState(false);
  let pressTimer;

  const handleContextMenu = (e) => {
    e.preventDefault(); // evita el menú del navegador
    setShowMenu(true);
  };

  const handleTouchStart = () => {
    pressTimer = setTimeout(() => setShowMenu(true), 500); // 0.5s presionado
  };

  const handleTouchEnd = () => {
    clearTimeout(pressTimer);
  };

  // Verifica si el usuario actual es el remitente del mensaje
  if (user?.username === messageData.sender_username) {
    return (
      <li
        onContextMenu={handleContextMenu}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="flex flex-col p-2 text-white max-w-xs ml-auto relative"
      >
        <div>
          <div className="relative">
            <video src={messageData.file_url} controls className={`${showMenu ? "opacity-50" : ""}`} />
            <time className="text-sm ml-auto mt-2 absolute top-1 right-3 bg-black/60 rounded-md p-0.5">
              {formatTimestampToHHMM(messageData.sent_at)}
            </time>
          </div>
          {messageData.content && (
            <p className="bg-blue-500 p-2 break-words whitespace-pre-line rounded-b-md">
              {messageData.content}
            </p>
          )}
        </div>
        <AnimatePresence>
          {showMenu && (
            <Motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black rounded shadow-lg z-50 min-w-[120px]"
            >
              <button
                className="flex gap-2 items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                onClick={() => {
                  setShowMenu(false);
                  onDeleteMessage(messageData.message_id);
                }}
              >
                <FiTrash size={20} />
                Eliminar
              </button>
              <button
                className="flex gap-2 items-center w-full px-4 py-2 text-left hover:bg-gray-100 text-red-500"
                onClick={() => setShowMenu(false)}
              >
                <IoMdClose size={20} />
                Cancelar
              </button>
            </Motion.div>
          )}
        </AnimatePresence>
      </li>
    );
  }

  // Verifica si el chat es grupal
  if (typeChat === "group") {
    return (
      <li className="flex gap-2 p-2 text-white max-w-xs">
        <img
          src={messageData.sender_avatar}
          alt="picture-of-chat"
          className="object-cover w-8 h-8 rounded-full"
        />
        <div>
          <div className="relative">
            <video src={messageData.file_url} controls className="w-64 h-64" />
            <time className="text-sm ml-auto mt-2 absolute top-1 right-3 bg-black/60 rounded-md p-0.5">
              {formatTimestampToHHMM(messageData.sent_at)}
            </time>
          </div>
          {messageData.content && (
            <p className="bg-blue-500 p-2 break-words whitespace-pre-line rounded-b-md">
              {messageData.content}
            </p>
          )}
        </div>
      </li>
    );
  }

  // Verifica si el chat es privado
  if (typeChat === "private") {
    return (
      <li className="flex gap-2 p-2 text-white max-w-xs">
        <div>
          <div className="relative">
            <video src={messageData.file_url} controls className="w-64 h-64" />
            <time className="text-sm ml-auto mt-2 absolute top-1 right-3 bg-black/60 rounded-md p-0.5">
              {formatTimestampToHHMM(messageData.sent_at)}
            </time>
          </div>
          {messageData.content && (
            <p className="bg-blue-500 p-2 break-words whitespace-pre-line rounded-b-md">
              {messageData.content}
            </p>
          )}
        </div>
      </li>
    );
  }
};

export default VideoMessage;
