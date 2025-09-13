import { useNavigate } from "react-router-dom";
import { joinGroup } from "../services/groupsService";
import { useState } from "react";
import { useMenuStore } from "../store/menuStore";
import toast from "react-hot-toast";

const JoinGroupButton = ({ id }) => {
  const [joinLoading, setJoinLoading] = useState(false);

  const { closeSearchChats } = useMenuStore();

  const navigate = useNavigate();
  const onJoinGroup = async () => {
    // Lógica para unirse al grupo
    setJoinLoading(true);
    try {
      // Llamar al servicio para unirse al grupo
      await joinGroup(id);
      closeSearchChats();
      navigate('/');
    } catch {
      toast.error("Error al unirse al grupo. Inténtalo de nuevo.");
    } finally {
      setJoinLoading(false);
    }
  };

  return (
    <button
      disabled={joinLoading}
      onClick={onJoinGroup}
      className="bg-blue-500 text-white px-4 py-1 rounded-md cursor-pointer"
    >
      {joinLoading ? "Uniéndote..." : "Unirse al grupo"}
    </button>
  );
};

export default JoinGroupButton;
