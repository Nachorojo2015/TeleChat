import { IoCaretBackOutline } from "react-icons/io5";
import { leaveGroup } from "../services/groupsService";
import { useNavigate } from "react-router-dom";

const LeaveGroupButton = ({ id }) => {

  const navigate = useNavigate();

  const onLeaveGroup = async () => {
    try {
      const data = await leaveGroup(id);
      console.log("Leave group response:", data);
      alert("Has salido del grupo");
      navigate("/");
      // Aquí podrías redirigir al usuario a otra página si es necesario
    } catch (error) {
      console.error("Error leaving group:", error);
      alert("Error al salir del grupo");
    }
  };

  return (
    <li className="px-4 py-2 hover:bg-gray-100 rounded-md text-red-500">
      <button
        className="flex w-full items-center gap-6 cursor-pointer"
        onClick={onLeaveGroup}
      >
        <IoCaretBackOutline size={20} />
        <span>Salir del grupo</span>
      </button>
    </li>
  );
};

export default LeaveGroupButton;
