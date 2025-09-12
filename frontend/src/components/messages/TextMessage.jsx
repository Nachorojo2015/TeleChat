import { useState } from "react";
import { useUserStore } from "../../store/userStore";
import { formatTimestampToHHMM } from "../../utils/formatTimestampToHHMM";
import { isValidUrl } from "../../utils/isValidUrl";
import { Link } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { FiTrash } from "react-icons/fi";
import { deleteMessage } from "../../services/messagesService";
import { socket } from "../../socket/socket";
import { motion, AnimatePresence } from "framer-motion";

const onDeleteMessage = async (messageId) => {
  try {
    const data = await deleteMessage(messageId);
    console.log("Message deleted:", data);
    socket.emit("delete-message", { messageId });
  } catch (error) {
    console.error("Error deleting message:", error);
  }
};

const TextMessage = ({ messageData, typeChat }) => {
  const { user } = useUserStore();

  console.log(messageData);

  const [showMenu, setShowMenu] = useState(false);
  let pressTimer;

  const handleContextMenu = (e) => {
    e.preventDefault(); // evita el menú del navegador
    setShowMenu(true);
    console.log("Menú contextual activado");
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
        className={`bg-blue-500 rounded-l-xl flex flex-col rounded-b-xl p-2 text-white max-w-xs ml-auto break-words whitespace-pre-line relative ${showMenu ? "bg-blue-500/30" : ""}`}
      >
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
            <motion.div
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
            </motion.div>
          )}
        </AnimatePresence>
      </li>
    );
  }

  // Verifica si el chat es grupal
  if (typeChat === "group") {
    return (
      <li className="flex items-center gap-2">
        <img
          src={messageData.sender_avatar}
          alt="picture-of-chat"
          className="object-cover w-8 h-8 rounded-full"
        />
        <div className="bg-blue-500 p-2 rounded-b-xl break-words whitespace-pre-line max-w-xs text-white rounded-r-xl">
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

  // Verifica si el chat es privado
  if (typeChat === "private") {
    return (
      <li className="flex items-center gap-2">
        <div className="bg-blue-500 p-2 rounded-b-xl break-words whitespace-pre-line max-w-xs text-white rounded-r-xl">
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
