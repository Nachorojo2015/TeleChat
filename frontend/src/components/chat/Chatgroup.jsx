import Messages from "../Messages";
import { useNavigate, useParams } from "react-router-dom";
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
import JoinGroupButton from "../JoinGroupButton";
import LeaveGroupButton from "../LeaveGroupButton";
import DeleteChatButton from "../DeleteChatButton";
import ImageZoom from "../ImageZoom";
import BackHomeButton from "../BackHomeButton";
import { motion as Motion, AnimatePresence } from "framer-motion";

const Chatgroup = () => {
  const { id } = useParams();

  const [group, setGroup] = useState(null);

  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const navigate = useNavigate();

  const {
    isOpenEditGroupForm,
    openEditGroupForm,
    isOpenInfoGroup,
    openInfoGroup,
  } = useMenuStore();

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const data = await getGroup(id);
        setGroup(data);
      } catch {
        navigate("/");
      }
    };

    fetchGroup();

    socket.on("group-edited", (data) => {
      if (data.groupId === id) {
        setGroup((prevGroup) => ({ ...prevGroup, ...data.groupData }));
      }
    });

    return () => {
      socket.off("group-edited");
    };
  }, [id, navigate]);

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
        {/* Header */}
        <header className="flex items-center gap-4 p-1 px-3 bg-white shadow">
          <BackHomeButton />

          <ImageZoom
            width={50}
            height={50}
            url={group?.picture}
            alt="picture-of-group"
            styles={"rounded-full object-cover"}
          />

          <div>
            <b>{group?.title}</b>
            <p>
              {group?.quantity_members > 1
                ? `${group?.quantity_members} miembros`
                : `${group?.quantity_members} miembro`}
            </p>
          </div>

          <div className="ml-auto relative">
            {group?.role === "owner" || group?.role === "member" ? (
              <button
                className={`p-2 rounded-full hover:bg-slate-200 ${
                  isDropDownOpen ? "bg-slate-200" : ""
                } transition-colors duration-300`}
              >
                <SlOptionsVertical
                  className="cursor-pointer"
                  onClick={toggleDropDown}
                />
              </button>
            ) : (
              <JoinGroupButton id={id} />
            )}

            <AnimatePresence>
              {isDropDownOpen && (
                <Motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-12 bg-white shadow-md rounded-md w-48 z-10"
                >
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
                        <DeleteChatButton
                          title={group?.title}
                          picture={group?.picture}
                          type="group"
                          id={id}
                        />
                      </li>
                    </>
                  ) : (
                    group?.role === "member" && <LeaveGroupButton id={id} />
                  )}
                </Motion.ul>
              )}
            </AnimatePresence>
          </div>
        </header>

        <div className="relative flex flex-1">
          <ul className="overflow-y-auto overflow-x-hidden absolute h-full w-full px-4 py-2 scrollbar-transparent">
            <Messages chatId={id} typeChat="group" />
          </ul>
        </div>

        {/* Footer */}
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
