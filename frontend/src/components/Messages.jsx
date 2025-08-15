import { useEffect } from "react";
import { useState } from "react";
import { getMessages } from "../services/messagesService";
import TextMessage from "./messages/TextMessage";
import ImageMessage from "./messages/ImageMessage";
import AudioMessage from "./messages/AudioMessage";
import FileMessage from "./messages/FileMessage";
import VideoMessage from "./messages/VideoMessage";

import { io } from "socket.io-client";

const socket = io("http://localhost:3000", { withCredentials: true });

const Messages = ({ chatId, myUser }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Fetch messages for the chatId if needed
    const fetchMessages = async () => {
      const data = await getMessages(chatId);
      console.log("Messages data:", data);
      setMessages(data);
    };

    fetchMessages();

    const handleNewMessage = ({ message, chatId: incomingChatId }) => {
      if (incomingChatId === chatId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    // Listen for new messages from the socket
    socket.on("send-message", handleNewMessage);

    return () => {
      socket.off("send-message", handleNewMessage); // Limpieza
    };
  }, [chatId]);

  return (
    <ul className="flex flex-col gap-2">
      {messages.map((message) =>
        message.type === "text" ? (
          <TextMessage key={message.message_id} messageData={message} myUser={myUser} />
        ) : message.type === "image" ? (
          <ImageMessage key={message.message_id} messageData={message} />
        ) : message.type === "file" ? (
          <FileMessage key={message.message_id} messageData={message} />
        ) : message.type === "video" ? (
          <VideoMessage key={message.message_id} messageData={message} />
        ) : (
          <AudioMessage key={message.message_id} messageData={message} />
        )
      )}
    </ul>
  );
};

export default Messages;
