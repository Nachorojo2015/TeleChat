import { useState } from "react";
import { forwardRef } from "react"
import { socket } from "../socket/socket";
import { deleteChat } from "../services/chatsService";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";

const DeleteChatModal = forwardRef(({ title, picture, type, id }, ref) => {
  const [loader, setLoader] = useState(false);

  const closeDeleteGroupModal = () => {
    ref.current.close();
  };

  const handleDeleteGroup = async () => {
    setLoader(true);
    try {
      await deleteChat(id);
      closeDeleteGroupModal();
      socket.emit('delete-chat', id);
    } catch {
      toast.error("Error al eliminar el chat. Inténtalo de nuevo.");
    } finally {
      setLoader(false);
    }
  };

  return (
    <dialog
      ref={ref}
      className="p-3 rounded-md backdrop:bg-black/50 
             fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <div className="flex items-center gap-3">
        <img
          src={picture}
          alt="picture-of-group"
          className="w-10 h-10 rounded-full object-cover"
        />
        <p className="text-xl font-bold">Eliminar {type === "group" ? "grupo" : "chat"}</p>
      </div>

      <p className="mt-4">
        ¿Quieres eliminar <b>{title}</b>?
      </p>

      <div className="flex flex-col items-end mt-4">
        <button className="uppercase flex items-center gap-2 text-red-500 p-1 rounded-md transition-all hover:bg-red-50 cursor-pointer" onClick={handleDeleteGroup}>
          <span>Eliminar {type === "group" ? "grupo" : "chat"}</span>
          {loader ? <ClipLoader size={10} /> : null}
        </button>
        <button
          className="uppercase text-blue-500 p-1 rounded-md transition-all hover:bg-blue-50 cursor-pointer"
          onClick={closeDeleteGroupModal}
        >
          Cancelar
        </button>
      </div>
    </dialog>
  );
})

export default DeleteChatModal