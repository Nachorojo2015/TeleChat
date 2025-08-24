import { useUserStore } from "../../store/userStore";
import { formatTimestampToHHMM } from "../../utils/formatTimestampToHHMM";

const TextMessage = ({ messageData }) => {
  const { user } = useUserStore();

  // Verifica si el usuario actual es el remitente del mensaje
  if (user?.username === messageData.sender_username) {
    return (
      <li className="bg-blue-500 rounded-l-xl flex flex-col rounded-b-xl p-2 text-white max-w-xs ml-auto break-words">
        <p>{messageData.content}</p>
        <time className="text-[10px] ml-auto">
          {formatTimestampToHHMM(messageData.sent_at)}
        </time>
      </li>
    );
  }
};

export default TextMessage;
