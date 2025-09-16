import { useEffect, useRef, useState } from "react";
import { socket } from "../socket/socket";
import Messages from "./Messages";
import { useUserStore } from "../store/userStore";
import { getMessages } from "../services/messagesService";

const MessagesContainer = ({ id, chat, typeChat }) => {
  const messagesEndRef = useRef(null);
  const { user } = useUserStore();
  const [messages, setMessages] = useState([]);

  const isScrolledToBottom = (ref, offset = 10) => {
    if (!ref.current) return false;
    const { scrollTop, scrollHeight, clientHeight } = ref.current;
    return scrollHeight - scrollTop - clientHeight <= offset;
  };

  useEffect(() => {
    // Fetch messages for the chatId
    const fetchMessages = async () => {
      const data = await getMessages(id);
      setMessages(data);
      // Auto-scroll to the bottom after loading messages
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    };

    fetchMessages();

    const handleNewMessage = ({ message, chatId: incomingChatId }) => {
      if (incomingChatId === id) {
        setMessages((prevMessages) => [...prevMessages, message]);
        const wasAtBottom = isScrolledToBottom(messagesEndRef);
        // Auto-scroll only if the new message is from the current user or if already at the bottom
        if (message?.sender_username === user?.username || wasAtBottom) {
          setTimeout(() => {
            messagesEndRef.current.scrollTop =
              messagesEndRef.current.scrollHeight;
          }, 100);
        }
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
  }, [chat, id, user?.username]);

  return (
    <div className="relative flex flex-1">
      <ul
        ref={messagesEndRef}
        className="overflow-y-auto overflow-x-hidden absolute h-full w-full px-4 py-2 scrollbar-transparent"
      >
        <Messages messages={messages} typeChat={typeChat} />
      </ul>
    </div>
  );
};

export default MessagesContainer;
