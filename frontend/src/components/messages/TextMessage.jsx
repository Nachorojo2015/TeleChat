import { useUserStore } from "../../store/userStore";
import { formatTimestampToHHMM } from "../../utils/formatTimestampToHHMM";
import { isValidUrl } from "../../utils/isValidUrl";
import { Link } from "react-router-dom";

const TextMessage = ({ messageData, typeChat }) => {
  const { user } = useUserStore();

  // Verifica si el usuario actual es el remitente del mensaje
  if (user?.username === messageData.sender_username) {
    return (
      <li className="bg-blue-500 rounded-l-xl flex flex-col rounded-b-xl p-2 text-white max-w-xs ml-auto break-words whitespace-pre-line">
        {isValidUrl(messageData.content) ? (
          <Link
            to={messageData.content}
            className="underline transition hover:text-blue-200"
            rel="noopener noreferrer"
          >
            {messageData.content}
          </Link>
        ) : (
          <p>{messageData.content}</p>
        )}
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
        <div className="bg-blue-500 p-2 rounded-b-xl break-words whitespace-pre-line max-w-xs text-white rounded-r-xl">
          {isValidUrl(messageData.content) ? (
            <Link
              to={messageData.content}
              className="underline transition hover:text-blue-200"
              rel="noopener noreferrer"
            >
              {messageData.content}
            </Link>
          ) : (
            <p>{messageData.content}</p>
          )}
          <time className="text-[10px] ml-auto">
            {formatTimestampToHHMM(messageData.sent_at)}
          </time>
        </div>
      </li>
    );
  }

  // Verifica si el chat es privado
  if (typeChat === "private") {
    return (
      <li className="flex items-center gap-2">
        <div className="bg-blue-500 p-2 rounded-b-xl break-words whitespace-pre-line max-w-xs text-white rounded-r-xl">
          {isValidUrl(messageData.content) ? (
            <Link
              to={messageData.content}
              className="underline transition hover:text-blue-200"
              rel="noopener noreferrer"
            >
              {messageData.content}
            </Link>
          ) : (
            <p>{messageData.content}</p>
          )}
          <time className="text-[10px] ml-auto">
            {formatTimestampToHHMM(messageData.sent_at)}
          </time>
        </div>
      </li>
    );
  }
};

export default TextMessage;
