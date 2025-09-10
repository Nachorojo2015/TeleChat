import { useEffect } from "react";
import { useState } from "react";
import { getMessages } from "../services/messagesService";
import TextMessage from "./messages/TextMessage";
import ImageMessage from "./messages/ImageMessage";
import VideoMessage from "./messages/VideoMessage";
import { socket } from "../socket/socket";

const Messages = ({ chatId, typeChat }) => {
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

    const handleDeletedMessage = ({ messageId }) => {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.message_id !== messageId)
      );
    };

    // Listen for new messages from the socket
    socket.on("send-message", handleNewMessage);
    socket.on("message-deleted", handleDeletedMessage);

    return () => {
      socket.off("send-message", handleNewMessage); // Limpieza
      socket.off("message-deleted", handleDeletedMessage);
    };
  }, [chatId]);

  return (
    <ul className="flex flex-col gap-2">
      {messages.map((message) =>
        message.type === "text" ? (
          <TextMessage key={message.message_id} messageData={message} typeChat={typeChat} />
        ) : message.type === "image" ? (
          <ImageMessage key={message.message_id} messageData={message} typeChat={typeChat}/>
        ) : message.type === "video" ? (
          <VideoMessage key={message.message_id} messageData={message} typeChat={typeChat}/>
        ) : null
      )}
    </ul>
  );
};

export default Messages;
