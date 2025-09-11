import { useRef } from "react";
import { sendMessage } from "../services/messagesService";
import { FaArrowUp } from "react-icons/fa6";
import { socket } from "../socket/socket";

const MessageInput = ({ id }) => {
  const inputMessage = useRef(null);

  const handleSendMessage = async () => {
    if (!inputMessage.current.value.trim()) return;

    const messageData = {
      chatId: id,
      content: inputMessage.current.value,
      type: "text",
    };

    try {
      const messageCreated = await sendMessage(messageData);
      inputMessage.current.value = "";
      socket.emit("receive-message", { message: messageCreated, chatId: id });
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    }
  };

  return (
    <>
      <textarea
        placeholder="Escribe un mensaje..."
        className="w-full p-1 outline-none [field-sizing:content] max-h-16 resize-none h-auto"
        ref={inputMessage}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
      />
      <button
        className="cursor-pointer bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
        onClick={handleSendMessage}
      >
        <FaArrowUp />
      </button>
    </>
  );
};

export default MessageInput;
