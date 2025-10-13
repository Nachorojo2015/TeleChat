import { forwardRef, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { sendMessage } from "../services/messagesService";
import ClipLoader from "react-spinners/ClipLoader";
import { socket } from "../socket/socket";
import toast from "react-hot-toast";

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
      file,
    };

    setLoader(true);

    try {
      const messageCreated = await sendMessage(messageData);
      inputMessage.current.value = "";
      socket.emit("receive-message", { message: messageCreated, chatId: id });
      closeMediaModal();
    } catch {
      toast.error("No se pudo enviar el mensaje. Inténtalo de nuevo.");
    } finally {
      setLoader(false);
    }
  };

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box bg-white rounded">
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
        <p className="text-center text-sm text-gray-500 antialiased mb-2">
          Evita compartir datos como: <b>Tarjetas de crédito</b>,{" "}
          <b>Documentos</b> o <b>Contraseñas</b>.
        </p>
        {file?.type.startsWith("image/") ? (
          <img
            src={filePreview}
            alt="preview"
            className="w-[400px] max-h-[400px] rounded-md object-cover mx-auto"
          />
        ) : file?.type.startsWith("video/") ? (
          <video
            src={filePreview}
            controls
            className="w-[400px] max-h-[400px] rounded-md mx-auto"
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
            {loader ? (
              <ClipLoader
                color="white"
                size={20}
                cssOverride={{ display: "block", margin: "0 auto" }}
              />
            ) : (
              "Enviar"
            )}
          </button>
        </footer>
      </div>
    </dialog>
  );
});

export default MediaModal;
