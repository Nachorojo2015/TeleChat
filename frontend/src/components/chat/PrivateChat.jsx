import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPrivateChat } from "../../services/privateChatService";
import { formatLastSessionTime } from "../../utils/formatLastSessionTime";
import { SlOptionsVertical } from "react-icons/sl";
import { CiCircleInfo } from "react-icons/ci";
import MediaUploadButton from "../MediaUploadButton";
import MessageInput from "../MessageInput";
import { useMenuStore } from "../../store/menuStore";
import InfoPrivateChat from "../InfoPrivateChat";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import DeleteChatButton from "../DeleteChatButton";
import { motion as Motion, AnimatePresence } from "framer-motion";
import BackHomeButton from "../BackHomeButton";
import MessagesContainer from "../MessagesContainer";
import { ClipLoader } from "react-spinners";

const PrivateChat = () => {
  const { id } = useParams();

  const [privateChat, setPrivateChat] = useState(null);

  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const { isOpenInfoPrivateChat, openInfoPrivateChat } = useMenuStore();

  const [loader, setLoader] = useState(true);

  const navigate = useNavigate();

  const toggleDropDown = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  useEffect(() => {
    const fetchPrivateChat = async () => {
      try {
        const data = await getPrivateChat(id);
        setPrivateChat(data);
      } catch {
        navigate("/");
      } finally {
        setLoader(false);
      }
    };

    fetchPrivateChat();
  }, [id, navigate]);

  if (loader) {
    return (
      <div className="flex justify-center items-center w-full">
        <ClipLoader />
      </div>
    );
  }

  return (
    <>
      <div
        className={`xl:flex flex-col w-full ${
          isOpenInfoPrivateChat ? "hidden" : "flex"
        }`}
      >
        <header className="flex items-center gap-4 p-1 px-3 bg-white shadow">
          <BackHomeButton />

          <Zoom>
            <img
              src={privateChat?.profile_picture}
              alt="picture-of-group"
              className="w-12 h-12 rounded-full object-cover cursor-pointer shrink-0"
            />
          </Zoom>

          <div>
            <b className="text-black">{privateChat?.display_name}</b>
            <p className="text-black">{formatLastSessionTime(privateChat?.last_active)}</p>
          </div>

          <div className="ml-auto relative">
            <button
              className={`cursor-pointer transition-colors duration-300 hover:bg-slate-200 p-2 rounded-full ${
                isDropDownOpen ? "bg-slate-200" : ""
              }`}
            >
              <SlOptionsVertical onClick={toggleDropDown} color="black" />
            </button>

            <AnimatePresence>
              {isDropDownOpen && (
                <Motion.ul
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-12 bg-white shadow-md rounded-md w-48 z-10 origin-top-right"
                >
                  <li className="px-4 py-2 hover:bg-gray-100 rounded-md">
                    <button
                      className="flex w-full items-center gap-6 cursor-pointer"
                      onClick={openInfoPrivateChat}
                    >
                      <CiCircleInfo size={20} color="black" />
                      <span className="text-black">Ver info</span>
                    </button>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 rounded-md">
                    <DeleteChatButton
                      title={privateChat?.display_name}
                      picture={privateChat?.profile_picture}
                      type="private"
                      id={id}
                    />
                  </li>
                </Motion.ul>
              )}
            </AnimatePresence>
          </div>
        </header>

        <MessagesContainer id={id} chat={privateChat} typeChat="private" />

        <footer className="flex items-center justify-center gap-2 p-2 shadow bg-white">
          <MediaUploadButton id={id} />
          <MessageInput id={id} />
        </footer>
      </div>

      {/* Info Private chat */}
      {isOpenInfoPrivateChat && <InfoPrivateChat privateChat={privateChat} />}
    </>
  );
};

export default PrivateChat;
