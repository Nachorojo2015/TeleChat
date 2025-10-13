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
import MessagesContainer from "../MessagesContainer";
import { ClipLoader } from "react-spinners";

const Chatgroup = () => {
  const { id } = useParams();

  const [group, setGroup] = useState(null);

  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const [loader, setLoader] = useState(true);

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
      } finally {
        setLoader(false);
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

  if (loader) {
    return (
      <div className="flex justify-center items-center w-full">
        <ClipLoader />
      </div>
    );
  }

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
            styles={"w-12 h-12 rounded-full object-cover shrink-0"}
          />

          <div>
            <b>{group?.title}</b>
            <p>
              {group?.quantity_members > 1
                ? `${group?.quantity_members} miembros`
                : `${group?.quantity_members} miembro`}
            </p>
          </div>

          {group?.role === "owner" || group?.role === "member" ? (
            <div className="dropdown dropdown-bottom dropdown-end ml-auto">
              <div tabIndex={0} role="button" className="btn m-1">
                <SlOptionsVertical
                  className="cursor-pointer"
                  onClick={toggleDropDown}
                  color="black"
                />
              </div>
              <ul
                tabIndex="-1"
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 mt-2 mr-2 p-2 shadow-sm"
              >
                <li>
                  <button
                    className="flex items-center gap-6"
                    onClick={openInfoGroup}
                  >
                    <CiCircleInfo size={20} color="black" />
                    <span className="text-black">Info.</span>
                  </button>
                </li>
                {group?.role === "owner" ? (
                  <>
                    <li>
                      <button
                        className="flex items-center gap-6"
                        onClick={openEditGroupForm}
                      >
                        <LuPencil size={20} color="black" />
                        <span className="text-black">Editar</span>
                      </button>
                    </li>
                    <li>
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
              </ul>
            </div>
          ) : (
            <JoinGroupButton id={id} />
          )}
        </header>

        <MessagesContainer id={id} chat={group} typeChat="group" />

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
