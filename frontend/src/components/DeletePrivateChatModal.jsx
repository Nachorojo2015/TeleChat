import { forwardRef, useState } from "react";
import { socket } from "../socket/socket";
import ClipLoader from "react-spinners/ClipLoader";
import { deletePrivateChat } from "../services/privateChatService";

const DeletePrivateChatModal = forwardRef(({ privateChat, id }, ref) => {
  const [loader, setLoader] = useState(false);

  const closeDeletePrivateChatModal = () => {
    ref.current.close();
  };

  const handleDeletePrivateChat = async () => {
    try {
      setLoader(true);
      await deletePrivateChat(id);
      closeDeletePrivateChatModal();

      socket.emit('delete-private-chat', id);
    } catch (error) {
      console.log(error);
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
          src={privateChat?.profile_picture}
          alt="picture-of-group"
          className="w-10 h-10 rounded-full object-cover"
        />
        <p className="text-xl font-bold">Eliminar chat privado</p>
      </div>

      <p className="mt-4">
        ¿Quieres eliminar tu chat con <b>{privateChat?.display_name}</b>?
      </p>

      <div className="flex flex-col items-end mt-4">
        <button className="uppercase flex items-center gap-2 text-red-500 p-1 rounded-md transition-all hover:bg-red-50 cursor-pointer" onClick={handleDeletePrivateChat}>
          <span>Eliminar chat privado</span>
          {loader ? <ClipLoader size={10} /> : null}
        </button>
        <button
          className="uppercase text-blue-500 p-1 rounded-md transition-all hover:bg-blue-50 cursor-pointer"
          onClick={closeDeletePrivateChatModal}
        >
          Cancelar
        </button>
      </div>
    </dialog>
  );
});

export default DeletePrivateChatModal