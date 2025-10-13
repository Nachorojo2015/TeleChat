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
            <b>{privateChat?.display_name}</b>
            <p>
              {formatLastSessionTime(privateChat?.last_active)}
            </p>
          </div>

          <div className="dropdown dropdown-bottom dropdown-end ml-auto">
            <div tabIndex={0} role="button" className="btn m-1">
              <SlOptionsVertical onClick={toggleDropDown} />
            </div>
            <ul
              tabIndex="-1"
              className="dropdown-content menu bg-base-100 rounded-box w-52 mt-2 mr-2 p-2 shadow-sm"
            >
              <li>
                <button
                  className="flex items-center gap-6"
                  onClick={openInfoPrivateChat}
                >
                  <CiCircleInfo size={20} color="black" />
                  <span>Ver info</span>
                </button>
              </li>
              <li>
                <DeleteChatButton
                  title={privateChat?.display_name}
                  picture={privateChat?.profile_picture}
                  type="private"
                  id={id}
                />
              </li>
            </ul>
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
