import { IoCaretBackOutline } from "react-icons/io5";
import { leaveGroup } from "../services/groupsService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LeaveGroupButton = ({ id }) => {

  const navigate = useNavigate();

  const onLeaveGroup = async () => {
    try {
      await leaveGroup(id);
      navigate("/");
    } catch {
      toast.error("Error al salir del grupo. Inténtalo de nuevo.");
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
