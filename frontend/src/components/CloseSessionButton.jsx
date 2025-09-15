import { CiLogout } from "react-icons/ci";
import { useRef } from "react";
import CloseSessionModal from "./CloseSessionModal";

const CloseSessionButton = () => {
  const closeSessionModal = useRef(null);
  

  return (
    <>
    <button
      className="w-full flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 text-red-500"
      onClick={() => closeSessionModal.current.showModal()}
    >
      <CiLogout size={20} />
      <span>Cerrar sesión</span>
    </button>

    <CloseSessionModal ref={closeSessionModal} />
    </>
  );
};

export default CloseSessionButton;
