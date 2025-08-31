import { forwardRef, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { sendMessage } from "../services/messagesService";
import { io } from "socket.io-client";
import ClipLoader from "react-spinners/ClipLoader";

const socket = io("http://localhost:3000", { withCredentials: true });

const MediaModal = forwardRef(({ file, filePreview, id }, ref) => {
  const inputMessage = useRef(null);

  const [loader, setLoader] = useState(false);

  const closeMediaModal = () => {
    ref.current.close();
  };

  const handleSendMessage = async () => {
    const messageData = {
      chatId: id,
      content: inputMessage.current.value,
      type: file?.type.startsWith("image/") ? "image" : "video",
      file
    };

    setLoader(true);

    try {
      const messageCreated = await sendMessage(messageData);
      inputMessage.current.value = "";
      socket.emit("receive-message", { message: messageCreated, chatId: id });
      closeMediaModal();
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <dialog
      ref={ref}
      className="p-3 rounded-md max-w-[400px] backdrop:bg-black/50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <header className="flex items-center gap-5 mb-4">
        <button className="cursor-pointer" onClick={closeMediaModal}>
          <IoMdClose size={25} />
        </button>
        {file?.type.startsWith("image/") ? (
          <h2 className="font-bold text-xl">Enviar Foto</h2>
        ) : file?.type.startsWith("video/") ? (
          <h2 className="font-bold text-xl">Enviar Video</h2>
        ) : null}
      </header>
      {file?.type.startsWith("image/") ? (
        <img
          src={filePreview}
          alt="preview"
          className="w-[400px] max-h-[400px] rounded-md object-cover"
        />
      ) : file?.type.startsWith("video/") ? (
        <video
          src={filePreview}
          controls
          className="w-[400px] max-h-[400px] rounded-md"
        />
      ) : null}
      <footer className="mt-4 flex items-center gap-3">
        <textarea
          placeholder="Escribe un mensaje..."
          className="w-full p-1 outline-none [field-sizing:content] max-h-24 resize-none h-auto"
          ref={inputMessage}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <button
          onClick={handleSendMessage}
          disabled={loader}
          className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          { loader ? <ClipLoader color="white" size={20} cssOverride={{ display: "block", margin: "0 auto" }} /> : "Enviar" }
        </button>
      </footer>
    </dialog>
  );
});

export default MediaModal;
