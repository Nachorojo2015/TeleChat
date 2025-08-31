import { useUserStore } from "../../store/userStore";
import { formatTimestampToHHMM } from "../../utils/formatTimestampToHHMM";

const ImageMessage = ({ messageData }) => {
  console.log(messageData);
  const { user } = useUserStore();
  // Verifica si el usuario actual es el remitente del mensaje
  if (user?.username === messageData.sender_username) {
    return (
      <li className="flex flex-col p-2 text-white max-w-xs ml-auto">
        <div>
          <div className="relative">
            <img
              src={messageData.file_url}
              alt="picture-of-chat"
              className="object-cover"
              width={messageData.width}
              height={messageData.height}
            />
            <time className="text-sm ml-auto mt-2 absolute bottom-1 right-3 bg-black/60 rounded-md p-0.5">
              {formatTimestampToHHMM(messageData.sent_at)}
            </time>
          </div>
          {messageData.content && (
            <p className="bg-blue-500 p-2 break-words whitespace-pre-line rounded-b-md">
              {messageData.content}
            </p>
          )}
        </div>
      </li>
    );
  }
};

export default ImageMessage;
