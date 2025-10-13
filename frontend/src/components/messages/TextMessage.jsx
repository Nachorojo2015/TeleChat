import { useState } from "react";
import { useUserStore } from "../../store/userStore";
import { formatTimestampToHHMM } from "../../utils/formatTimestampToHHMM";
import { isValidUrl } from "../../utils/isValidUrl";
import { Link } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { FiTrash } from "react-icons/fi";
import { deleteMessage } from "../../services/messagesService";
import { socket } from "../../socket/socket";
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

const TextMessage = ({ messageData, typeChat }) => {
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
      <div
        onContextMenu={handleContextMenu}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="chat chat-end"
      >
        <div className={`chat-bubble break-words whitespace-pre-line max-w-xs bg-blue-500 rounded-2xl text-white relative ${showMenu ? "bg-blue-500/30" : ""}`}>
          {isValidUrl(messageData.content) ? (
            <Link
              to={messageData.content}
              className="underline transition hover:text-blue-200"
              rel="noopener noreferrer"
            >
              {messageData.content}
            </Link>
          ) : (
            <p>{messageData.content}</p>
          )}
          <time className="text-[10px] ml-auto">
            {formatTimestampToHHMM(messageData.sent_at)}
          </time>

          {/* Menú contextual */}
          <AnimatePresence>
            {showMenu && (
              <Motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-0 right-5 bg-white text-black rounded shadow-lg z-50 min-w-[120px]"
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
        </div>
      </div>
    );
  }

  // Verifica si el chat es grupal
  if (typeChat === "group") {
    return (
      <div className="chat chat-start">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img
              src={messageData.sender_avatar}
              alt="picture-of-chat"
              className="object-cover w-8 h-8 rounded-full"
            />
          </div>
        </div>
        <div className="chat-bubble bg-blue-500 p-2 rounded-2xl break-words whitespace-pre-line max-w-xs text-white">
          {isValidUrl(messageData.content) ? (
            <Link
              to={messageData.content}
              className="underline transition hover:text-blue-200"
              rel="noopener noreferrer"
            >
              {messageData.content}
            </Link>
          ) : (
            <p>{messageData.content}</p>
          )}
          <time className="text-[10px] ml-auto">
            {formatTimestampToHHMM(messageData.sent_at)}
          </time>
        </div>
      </div>
    );
  }

  // Verifica si el chat es privado
  if (typeChat === "private") {
    return (
      <li className="flex items-center gap-2 chat chat-start">
        <div className="bg-blue-500 chat-bubble p-2 break-words whitespace-pre-line max-w-xs text-white rounded-2xl">
          {isValidUrl(messageData.content) ? (
            <Link
              to={messageData.content}
              className="underline transition hover:text-blue-200"
              rel="noopener noreferrer"
            >
              {messageData.content}
            </Link>
          ) : (
            <p>{messageData.content}</p>
          )}
          <time className="text-[10px] ml-auto">
            {formatTimestampToHHMM(messageData.sent_at)}
          </time>
        </div>
      </li>
    );
  }
};

export default TextMessage;
