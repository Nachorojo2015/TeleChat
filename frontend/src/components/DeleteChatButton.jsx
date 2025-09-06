import { useRef } from "react";
import DeleteChatModal from "./DeleteChatModal";
import { FaTrash } from "react-icons/fa6";

const DeleteChatButton = ({ title, picture, type, id }) => {
  const deleteChatModal = useRef(null);
  const openDeleteChatModal = () => {
    deleteChatModal.current.showModal();
  };
  return (
    <>
      <button
        className="flex w-full items-center gap-6 cursor-pointer"
        onClick={openDeleteChatModal}
      >
        <FaTrash color="red" size={20} />
        <span>Eliminar {type === "group" ? "grupo" : "chat"}</span>
      </button>

      {/* Modal para borrar un chat */}
      <DeleteChatModal ref={deleteChatModal} title={title} picture={picture} type={type} id={id} />
    </>
  );
};

export default DeleteChatButton;
