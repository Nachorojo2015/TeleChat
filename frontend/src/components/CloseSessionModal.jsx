import { forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth/authService";
import toast from "react-hot-toast";

const CloseSessionModal = forwardRef((_, ref) => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch {
      toast.error("Error al cerrar sesión. Inténtalo de nuevo.");
    }
  };
  return (
    <dialog
      ref={ref}
      className="modal"
    >
      <div className="modal-box bg-white rounded">
        <h2 className="text-xl font-bold">TeleChat</h2>
        <p className="text-lg">¿Quieres cerrar sesión?</p>
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 cursor-pointer text-blue-500 rounded-md hover:bg-blue-600/10 transition"
            onClick={() => ref.current.close()}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 cursor-pointer text-red-500 rounded-md hover:bg-red-600/10 transition"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </dialog>
  );
});

export default CloseSessionModal;
