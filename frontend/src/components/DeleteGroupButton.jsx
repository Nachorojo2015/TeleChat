import { useRef } from "react";
import { FaTrash } from "react-icons/fa6";
import DeleteGroupModal from "./DeleteGroupModal";

const DeleteGroupButton = ({ group, id }) => {
  const deleteGroupModal = useRef(null);
  const openDeleteGroupModal = () => {
    deleteGroupModal.current.showModal();
  };
  return (
    <>
      <button
        className="flex w-full items-center gap-6 cursor-pointer"
        onClick={openDeleteGroupModal}
      >
        <FaTrash color="red" size={20} />
        <span>Eliminar grupo</span>
      </button>

      {/* Modal para borrar un grupo */}
      <DeleteGroupModal ref={deleteGroupModal} group={group} id={id} />
    </>
  );
};

export default DeleteGroupButton;
