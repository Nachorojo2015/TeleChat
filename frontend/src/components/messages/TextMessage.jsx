import { useUserStore } from "../../store/userStore";
import { formatTimestampToHHMM } from "../../utils/formatTimestampToHHMM";

const TextMessage = ({ messageData, typeChat }) => {
  const { user } = useUserStore();

  // Verifica si el usuario actual es el remitente del mensaje
  if (user?.username === messageData.sender_username) {
    return (
      <li className="bg-blue-500 rounded-l-xl flex flex-col rounded-b-xl p-2 text-white max-w-xs ml-auto break-words whitespace-pre-line">
        <p>{messageData.content}</p>
        <time className="text-[10px] ml-auto">
          {formatTimestampToHHMM(messageData.sent_at)}
        </time>
      </li>
    );
  }


  // Verifica si el chat es grupal
  if (typeChat === "group") {
    return (
      <li className="flex items-center gap-2">
        <img
          src={messageData.sender_avatar}
          alt="picture-of-chat"
          className="object-cover w-8 h-8 rounded-full"
        />
        <div className="bg-blue-500 p-2 rounded-b-xl break-words whitespace-pre-line max-w-xs text-white  rounded-r-xl">
          <p>{messageData.content}</p>
          <time className="text-[10px] ml-auto">
            {formatTimestampToHHMM(messageData.sent_at)}
          </time>
        </div>
      </li>
    );
  }
};

export default TextMessage;
