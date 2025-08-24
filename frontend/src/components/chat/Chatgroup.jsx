import { FaPaperclip, FaTrash } from "react-icons/fa6";
import { FaArrowUp } from "react-icons/fa6";
import Messages from "../Messages";
import { useParams } from "react-router-dom";
import { SlOptionsVertical } from "react-icons/sl";
import { useEffect } from "react";
import { getGroup } from "../../services/groupsService";
import { useState } from "react";
import { sendMessage } from "../../services/messagesService";
import { useRef } from "react";
import { LuPencil } from "react-icons/lu";
import { io } from "socket.io-client";
import { useMenuStore } from "../../store/menuStore";
import EditGroupForm from "../EditGroupForm";
import InfoGroup from "../InfoGroup";
import DeleteGroupModal from "../DeleteGroupModal";

const socket = io("http://localhost:3000", { withCredentials: true });

const Chatgroup = () => {
  const { id } = useParams();

  const [group, setGroup] = useState(null);

  const [message, setMessage] = useState("");

  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const deleteGroupModal = useRef(null);

  const {
    isOpenEditGroupForm,
    openEditGroupForm,
    isOpenInfoGroup,
    openInfoGroup,
  } = useMenuStore();

  const inputMessage = useRef(null);

  useEffect(() => {
    const fetchGroup = async () => {
      const data = await getGroup(id);
      console.log("Group data:", data);
      setGroup(data);
    };

    fetchGroup();

    socket.on("group-edited", (data) => {
      if (data.groupId === id) {
        console.log("Grupo editado desde el socket:", data.groupData);
        setGroup((prevGroup) => ({ ...prevGroup, ...data.groupData }));
      }
    });

    return () => {
      socket.off("group-edited");
    };
  }, [id]);

  const toggleDropDown = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  const handleMessage = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!message) return;

    const messageData = {
      chatId: id,
      replyId: "",
      content: message,
      type: "text",
      forwardedId: "",
    };

    try {
      const messageCreated = await sendMessage(messageData);
      setMessage("");
      inputMessage.current.value = "";
      socket.emit("receive-message", { message: messageCreated, chatId: id });
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    }
  };

  const openDeleteGroupModal = () => {
    deleteGroupModal.current.showModal();
  };

  return (
    <>
      {/* Chat */}
      <div className="flex flex-col w-full">
        <header className="flex items-center gap-4 p-1 px-6 bg-white shadow">
          <img
            src={group?.picture}
            alt="picture-of-group"
            className="w-12 h-12 rounded-full object-cover cursor-pointer"
            onClick={openInfoGroup}
          />

          <div>
            <b>{group?.title}</b>
            <p>{group?.quantity_members} miembros</p>
          </div>

          <div className="ml-auto relative">
            <SlOptionsVertical
              className="cursor-pointer"
              onClick={toggleDropDown}
            />

            {isDropDownOpen && (
              <ul className="absolute right-0 top-12 bg-white shadow-md rounded-md w-48 z-10">
                {group?.role === "owner" && (
                  <>
                    <li className="px-4 py-2 hover:bg-gray-100 rounded-md">
                      <button
                        className="flex items-center gap-6 cursor-pointer"
                        onClick={openEditGroupForm}
                      >
                        <LuPencil size={20} />
                        <span>Editar</span>
                      </button>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 rounded-md">
                      <button
                        className="flex items-center gap-6 cursor-pointer"
                        onClick={openDeleteGroupModal}
                      >
                        <FaTrash color="red" size={20} />
                        <span>Eliminar grupo</span>
                      </button>
                    </li>
                  </>
                )}
              </ul>
            )}
          </div>
        </header>

        <div className="relative flex flex-1">
          <ul className="overflow-y-auto overflow-x-hidden absolute h-full w-full px-4 py-2">
            <Messages chatId={id} typeChat="group" />
          </ul>
        </div>

        <footer className="flex items-center gap-2 p-2 shadow bg-white">
          <FaPaperclip size={20} />
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            className="w-full p-1 outline-none"
            onChange={handleMessage}
            ref={inputMessage}
          />
          <button
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
            onClick={handleSendMessage}
          >
            <FaArrowUp />
          </button>
        </footer>
      </div>

      {/* Info Group */}
      {isOpenEditGroupForm ? (
        <EditGroupForm group={group} id={id} />
      ) : isOpenInfoGroup ? (
        <InfoGroup group={group} id={id} />
      ) : (
        <></>
      )}

      <DeleteGroupModal ref={deleteGroupModal} group={group} />
    </>
  );
};

export default Chatgroup;
