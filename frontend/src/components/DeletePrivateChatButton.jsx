import { useRef } from "react";
import { FaTrash } from "react-icons/fa6";
import DeletePrivateChatModal from "./DeletePrivateChatModal";

const DeletePrivateChatButton = ({ privateChat, id }) => {
  const deletePrivateChatModal = useRef(null);
  const openDeletePrivateChatModal = () => {
    deletePrivateChatModal.current.showModal();
  };
  return (
    <>
      <button
        className="flex w-full items-center gap-6 cursor-pointer"
        onClick={openDeletePrivateChatModal}
      >
        <FaTrash color="red" size={20} />
        <span>Eliminar chat</span>
      </button>

      {/* Modal para borrar un chat privado */}
      <DeletePrivateChatModal ref={deletePrivateChatModal} privateChat={privateChat} id={id} />
    </>
  );
}

export default DeletePrivateChatButton