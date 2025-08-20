import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getChannel } from "../../services/channelsService";
import { useState } from "react";
import { SlOptionsVertical } from "react-icons/sl";
import Messages from "../Messages";
import { FaArrowUp, FaPaperclip } from "react-icons/fa6";
import { useUserStore } from "../../store/userStore";

const ChatChannel = () => {
  const { id } = useParams();

  const { user } = useUserStore();

  const [channel, setChannel] = useState(null);

  useEffect(() => {
    const fetchChannel = async () => {
      const data = await getChannel(id);
      setChannel(data);
    };

    fetchChannel();
  }, [id]);

  console.log("Channel data:", channel);

  return (
    <>
      <div className="flex flex-col w-full">
        <header className="flex items-center gap-4 p-1 px-6 bg-white shadow">
          <img
            src={channel?.picture}
            alt="picture-of-group"
            className="w-12 h-12 rounded-full object-cover cursor-pointer"
          />

          <div>
            <b>{channel?.title}</b>
            <p>{channel?.quantity_members} miembros</p>
          </div>

          <div className="ml-auto relative">
            <SlOptionsVertical className="cursor-pointer" />
          </div>
        </header>

        <div className="relative flex flex-1">
          <ul className="overflow-y-auto overflow-x-hidden absolute h-full w-full px-4 py-2">
            <Messages chatId={id} typeChat="channel" />
          </ul>
        </div>

        {user?.username === channel?.owner_username && (
          <footer className="flex items-center gap-2 p-2 shadow bg-white">
            <FaPaperclip size={20} />
            <input
              type="text"
              placeholder="Difusión"
              className="w-full p-1 outline-none"
            />
            <button className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors">
              <FaArrowUp />
            </button>
          </footer>
        )}
      </div>
    </>
  );
};

export default ChatChannel;
