import { useEffect, useState } from "react";
import { getChats } from "../services/chatsService";
import { Link, useLocation } from "react-router-dom";
import { formatLastMessageChatTime } from "../utils/formatLastMessageChatTime";
import HashLoader from "react-spinners/HashLoader";
import { IoChatbubbleEllipses } from "react-icons/io5";

import { io } from "socket.io-client";

const socket = io("http://localhost:3000", { withCredentials: true });

const Chats = () => {
  const [chats, setChats] = useState(null);
  const [loader, setLoader] = useState(false);

  const location = useLocation();
  const chatId = location.pathname.split('/').pop();

  useEffect(() => {
    const fetchChats = async () => {
      setLoader(true);
      const data = await getChats();
      console.log("Chats data:", data);
      setChats(data);
      setLoader(false);
    };

    fetchChats();

    const handleNewMessage = ({ message, chatId }) => {
      console.log("New message received:", message, chatId);
      setChats((prevChats) => {
        return prevChats.map((chat) => {
          if (chat.id === chatId) {
            return { ...chat, content: message.content }; // Actualiza el contenido del chat
          }
          return chat;
        });
      });
    };

    socket.on("send-message", handleNewMessage);

    return () => {
      socket.off("send-message", handleNewMessage);
    };
  }, []);

  if (loader) {
    return (
      <ul className="flex items-center justify-center h-full w-full absolute">
        <HashLoader />
      </ul>
    );
  }

  if (chats?.length === 0) {
    return (
      <ul className="flex items-center justify-center h-full w-full absolute">
        <div className="flex flex-col items-center justify-center gap-3">
          <IoChatbubbleEllipses size={50}/>
          <p>No tienes chats</p>
          <p className="text-sm text-center font-semibold">Busca usuarios para chatear, unete a grupos o canales de difusión</p>
        </div>
      </ul>
    );
  }

  return (
    <ul className="overflow-y-auto p-3 overflow-x-hidden absolute h-full w-full">
      {
        chats?.map((chat) => (
          <Link
            to={
              chat.type === "group"
                ? `/g/${chat.id}`
                : chat.type === "channel"
                ? `/c/${chat.id}`
                : `/p/${chat.id}`
            }
            key={chat.id}
            className={`flex p-2 mt-1 items-center gap-2 transition-colors rounded-lg ${chat.id === chatId ? "bg-blue-500 text-white" : "hover:bg-slate-100"}`}
          >
            <img
              src={chat.picture}
              alt={chat.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="w-full">
              <div className="flex justify-between items-center">
                <b>{chat.title}</b>
                <time className="text-sm">
                  {formatLastMessageChatTime(chat?.sent_at)}
                </time>
              </div>
              <p>{chat.content}</p>
            </div>
          </Link>
        ))
      }
    </ul>
  );
};

export default Chats;
