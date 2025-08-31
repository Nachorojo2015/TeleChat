import { FaArrowLeft, FaPaperclip, FaTrash } from "react-icons/fa6";
import { FaArrowUp } from "react-icons/fa6";
import Messages from "../Messages";
import { Link, useParams } from "react-router-dom";
import { SlOptionsVertical, SlPicture } from "react-icons/sl";
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
import { CiCircleInfo } from "react-icons/ci";
import MediaModal from "../MediaModal";

const socket = io("http://localhost:3000", { withCredentials: true });

const Chatgroup = () => {
  const { id } = useParams();

  const [group, setGroup] = useState(null);

  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const [isDropUpOpen, setIsDropUpOpen] = useState(false);

  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const deleteGroupModal = useRef(null);

  const mediaModal = useRef(null);

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

  const handleSendMessage = async () => {
    if (!inputMessage.current.value) return;

    const messageData = {
      chatId: id,
      content: inputMessage.current.value,
      type: "text",
    };

    try {
      const messageCreated = await sendMessage(messageData);
      inputMessage.current.value = "";
      socket.emit("receive-message", { message: messageCreated, chatId: id });
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    }
  };

  const openDeleteGroupModal = () => {
    deleteGroupModal.current.showModal();
  };


  const handleShowMedia = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      // Si es imagen o video, genera la preview
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result);
          mediaModal.current.showModal();
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };


  return (
    <>
      {/* Chat */}
      <div
        className={`xl:flex flex-col w-full ${
          isOpenInfoGroup || isOpenEditGroupForm ? "hidden" : "flex"
        }`}
      >
        <header className="flex items-center gap-4 p-1 px-3 bg-white shadow">
          <Link to={"/"}>
            <FaArrowLeft />
          </Link>

          <img
            src={group?.picture}
            alt="picture-of-group"
            className="w-12 h-12 rounded-full object-cover cursor-pointer"
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
                        className="flex w-full items-center gap-6 cursor-pointer"
                        onClick={openInfoGroup}
                      >
                        <CiCircleInfo size={20} />
                        <span>Info.</span>
                      </button>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 rounded-md">
                      <button
                        className="flex w-full items-center gap-6 cursor-pointer"
                        onClick={openEditGroupForm}
                      >
                        <LuPencil size={20} />
                        <span>Editar</span>
                      </button>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 rounded-md">
                      <button
                        className="flex w-full items-center gap-6 cursor-pointer"
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
          <ul className="overflow-y-auto overflow-x-hidden absolute h-full w-full px-4 py-2 scrollbar-transparent">
            <Messages chatId={id} typeChat="group" />
          </ul>
        </div>

        <footer className="flex items-center justify-center gap-2 p-2 shadow bg-white">
          <div className="relative">
            <button
              className="cursor-pointer"
              onClick={() => setIsDropUpOpen((prev) => !prev)}
            >
              <FaPaperclip size={20} />
            </button>
            {isDropUpOpen && (
              <div className="absolute bottom-12 left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-40 z-20">
                <label className="w-full cursor-pointer flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100 text-gray-700">
                  <SlPicture />
                  <span>Foto o video</span>

                  <input
                    type="file"
                    hidden
                    accept=".jpg, .jpeg, .png, .gif, .webp, .mp4"
                    onChange={handleShowMedia}
                  />
                </label>
              </div>
            )}
          </div>
          <textarea
            placeholder="Escribe un mensaje..."
            className="w-full p-1 outline-none [field-sizing:content] max-h-16 resize-none h-auto"
            ref={inputMessage}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
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

      {/* Modal para borrar un grupo */}
      <DeleteGroupModal ref={deleteGroupModal} group={group} id={id} />

      {/* Modal para mostrar archivos multimedia */}
      <MediaModal ref={mediaModal} file={file} filePreview={filePreview} id={id} />
    </>
  );
};

export default Chatgroup;
