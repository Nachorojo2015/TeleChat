import TextMessage from "./messages/TextMessage";
import ImageMessage from "./messages/ImageMessage";
import VideoMessage from "./messages/VideoMessage";

const Messages = ({ messages, typeChat }) => {


  return (
    <ul className="flex flex-col gap-2">
      {messages.map((message) =>
        message.type === "text" ? (
          <TextMessage key={message.message_id} messageData={message} typeChat={typeChat} />
        ) : message.type === "image" ? (
          <ImageMessage key={message.message_id} messageData={message} typeChat={typeChat}/>
        ) : message.type === "video" ? (
          <VideoMessage key={message.message_id} messageData={message} typeChat={typeChat}/>
        ) : null
      )}
    </ul>
  );
};

export default Messages;
