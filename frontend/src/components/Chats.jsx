import { useEffect, useState } from "react";
import { getChats } from "../services/chatsService";
import { Link } from "react-router-dom";
import { formatLastMessageChatTime } from "../utils/formatLastMessageChatTime";

import { io } from "socket.io-client";

const socket = io("http://localhost:3000", { withCredentials: true });

const Chats = () => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      const data = await getChats();
      console.log("Chats data:", data);
      setChats(data);
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

  return (
    <ul className="overflow-y-auto p-3">
      {chats?.length === 0 ? (
        <li>No hay chats disponibles</li>
      ) : (
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
            className="flex p-2 items-center gap-2 hover:bg-slate-100 transition-colors rounded-lg"
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
      )}
    </ul>
  );
};

export default Chats;
