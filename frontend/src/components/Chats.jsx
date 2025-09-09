import { useEffect, useState } from "react";
import { getChats } from "../services/chatsService";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { formatLastMessageChatTime } from "../utils/formatLastMessageChatTime";
import HashLoader from "react-spinners/HashLoader";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaImage, FaVideo } from "react-icons/fa6";
import { socket } from "../socket/socket";
import { useUserStore } from "../store/userStore";

const Chats = () => {
  const [chats, setChats] = useState([]);
  const [loader, setLoader] = useState(false);

  const { user } = useUserStore();

  const location = useLocation();
  const chatId = location.pathname.split("/").pop();

  const navigate = useNavigate();

  console.log(loader);

  useEffect(() => {
    const fetchChats = async () => {
      setLoader(true);

      try {
        const chats = await getChats();
        setChats(chats);
      } catch (error) {
        console.log(error);
      } finally {
        setLoader(false);
      }
    };

    fetchChats();

    // Sockets
    const handleNewMessage = ({ message, chatId }) => {
      console.log("New message received:", message, chatId);
      setChats((prevChats) => {
        return prevChats.map((chat) => {
          if (chat.id === chatId) {
            return {
              ...chat,
              content: message.content,
              message_type: message.type,
            }; // Actualiza el contenido del chat
          }
          return chat;
        });
      });
    };

    socket.on("send-message", handleNewMessage);

    socket.on("group-edited", ({ groupId, groupData }) => {
      setChats((prevChats) => {
        return prevChats.map((chat) => {
          if (chat.id === groupId) {
            return {
              ...chat,
              picture: groupData.picture ?? chat.picture,
              title: groupData.title || chat.title,
            }; // Actualiza los datos del grupo
          }
          return chat;
        });
      });
    });

    socket.on("chat-deleted", ({ chatId }) => {
      if (chatId === chatId) {
        navigate("/");
      }

      setChats((prevChats) => {
        const updatedChats = prevChats.filter((chat) => chat.id !== chatId);
        return updatedChats;
      });
    });

    return () => {
      socket.off("send-message", handleNewMessage);
      socket.off("group-deleted");
      socket.off("group-edited");
    };
  }, [chatId, navigate]);

  if (loader) {
    return (
      <ul className="flex items-center justify-center h-full w-full absolute">
        <HashLoader />
      </ul>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full absolute gap-3">
        <p>No estás autenticado.</p>
        <Link to="/login" className="text-blue-500">Iniciar sesión para comenzar a chatear</Link>
      </div>
    )
  }

  if (chats?.length === 0) {
    return (
      <ul className="flex items-center justify-center h-full w-full absolute">
        <div className="flex flex-col items-center justify-center gap-3">
          <IoChatbubbleEllipses size={50} />
          <p>No tienes chats</p>
          <p className="text-sm text-center font-semibold px-1">
            Busca usuarios para chatear o unete a grupos creados por la
            comunidad
          </p>
        </div>
      </ul>
    );
  }

  return (
    <ul className="overflow-y-auto p-3 overflow-x-hidden absolute h-full w-full">
      {chats?.map((chat) => (
        <Link
          to={chat.type === "group" ? `/g/${chat.id}` : `/p/${chat.id}`}
          key={chat.id}
          className={`flex p-2 mt-1 items-center gap-2 transition-colors rounded-lg ${
            chat.id === chatId ? "bg-blue-500 text-white" : "hover:bg-slate-100"
          }`}
        >
          <img
            src={chat.picture || chat.other_profile_picture}
            alt={chat.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="w-full">
            <div className="flex justify-between items-center">
              <b className="break-words truncate max-w-[200px]">
                {chat.title || chat.other_display_name}
              </b>
              <time className="text-sm">
                {chat.sent_at && formatLastMessageChatTime(chat?.sent_at)}
              </time>
            </div>
            {chat.message_type === "image" ? (
              <div className="flex items-center gap-2">
                <FaImage />
                <p className="break-words truncate max-w-[200px]">
                  {chat.content || "Imagen"}
                </p>
              </div>
            ) : chat.message_type === "video" ? (
              <div className="flex items-center gap-2">
                <FaVideo />
                <p className="break-words truncate max-w-[200px]">
                  {chat.content || "Video"}
                </p>
              </div>
            ) : (
              <p className="break-words truncate max-w-[200px]">
                {chat.content}
              </p>
            )}
          </div>
        </Link>
      ))}
    </ul>
  );
};

export default Chats;
