import { FaArrowLeft } from "react-icons/fa6";
import Messages from "../Messages";
import { Link, useParams } from "react-router-dom";
import { SlOptionsVertical } from "react-icons/sl";
import { useEffect } from "react";
import { getGroup } from "../../services/groupsService";
import { useState } from "react";
import { LuPencil } from "react-icons/lu";
import { useMenuStore } from "../../store/menuStore";
import EditGroupForm from "../EditGroupForm";
import InfoGroup from "../InfoGroup";
import { CiCircleInfo } from "react-icons/ci";
import MediaUploadButton from "../MediaUploadButton";
import MessageInput from "../MessageInput";
import { socket } from "../../socket/socket";
import DeleteGroupButton from "../DeleteGroupButton";
import JoinGroupButton from "../JoinGroupButton";
import LeaveGroupButton from "../LeaveGroupButton";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const Chatgroup = () => {
  const { id } = useParams();

  const [group, setGroup] = useState(null);

  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const {
    isOpenEditGroupForm,
    openEditGroupForm,
    isOpenInfoGroup,
    openInfoGroup,
  } = useMenuStore();

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

          <Zoom>
            <img
              src={group?.picture}
              alt="picture-of-group"
              className="w-12 h-12 rounded-full object-cover cursor-pointer"
            />
          </Zoom>

          <div>
            <b>{group?.title}</b>
            <p>{group?.quantity_members} miembros</p>
          </div>

          <div className="ml-auto relative">
            {(group?.role === "owner" || group?.role === "member") ? (
              <SlOptionsVertical
                className="cursor-pointer"
                onClick={toggleDropDown}
              />
            ) : (
              <JoinGroupButton id={id} />
            )}

            {isDropDownOpen && (
              <ul className="absolute right-0 top-12 bg-white shadow-md rounded-md w-48 z-10">
                <li className="px-4 py-2 hover:bg-gray-100 rounded-md">
                  <button
                    className="flex w-full items-center gap-6 cursor-pointer"
                    onClick={openInfoGroup}
                  >
                    <CiCircleInfo size={20} />
                    <span>Info.</span>
                  </button>
                </li>
                {group?.role === "owner" ? (
                  <>
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
                      <DeleteGroupButton group={group} id={id} />
                    </li>
                  </>
                ) : (
                  group?.role === "member" && (
                    <LeaveGroupButton id={id} />
                  )
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

        {(group?.role === "owner" || group?.role === "member") && (
          <footer className="flex items-center justify-center gap-2 p-2 shadow bg-white">
            <MediaUploadButton id={id} />
            <MessageInput id={id} />
          </footer>
        )}
      </div>

      {/* Info Group */}
      {isOpenEditGroupForm ? (
        <EditGroupForm group={group} id={id} />
      ) : isOpenInfoGroup ? (
        <InfoGroup group={group} id={id} />
      ) : (
        <></>
      )}
    </>
  );
};

export default Chatgroup;
