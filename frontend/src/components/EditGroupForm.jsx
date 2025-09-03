import { FaArrowLeft } from "react-icons/fa6";
import { useMenuStore } from "../store/menuStore";
import { CiCamera } from "react-icons/ci";
import { useState } from "react";
import { editGroup } from "../services/groupsService";
import { MdPublic } from "react-icons/md";
import { RiGitRepositoryPrivateFill } from "react-icons/ri";
import ClipLoader from "react-spinners/ClipLoader";
import { socket } from "../socket/socket";

const EditGroupForm = ({ group, id }) => {
  const { closeEditGroupForm } = useMenuStore();

  const [picture, setPicture] = useState(null);
  const [picturePreview, setPicturePreview] = useState(group?.picture);

  const [title, setTitle] = useState(group?.title || "");

  const [description, setDescription] = useState(group?.description || "");

  const [isPublic, setIsPublic] = useState(group?.is_public || false);

  const [loader, setLoader] = useState(false);

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleDescription = (e) => {
    setDescription(e.target.value);
  };

  const handlePicture = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPicture(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublicGroup = () => {
    setIsPublic(true);
  };

  const handlePrivateGroup = () => {
    setIsPublic(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const groupData = {
      title,
      description,
      is_public: isPublic,
      picture,
    };

    setLoader(true);

    try {
      const updatedGroup = await editGroup(id, groupData);
      console.log("Grupo editado:", updatedGroup);

      socket.emit("edit-group", {
        groupId: id,
        groupData: updatedGroup.groupData,
      });
    } catch (error) {
      console.error("Error al editar el grupo:", error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="shadow flex flex-col h-screen xl:w-[40%] w-full relative bg-white">
      <header className="flex items-center gap-4 p-4">
        <FaArrowLeft
          size={24}
          onClick={closeEditGroupForm}
          className="cursor-pointer"
        />
        <b>Editar</b>
      </header>

      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 py-3">
          {/* Editar imagen */}
          <label>
            <picture className="relative group cursor-pointer m-auto">
              <img
                src={picturePreview}
                alt="picture-of-group"
                className="object-cover rounded-full m-auto w-52 h-52"
                style={{ filter: "brightness(50%)" }}
                accept="image/*"
              />
              <CiCamera
                size={60}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition"
                color="white"
              />
            </picture>

            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handlePicture}
            />
          </label>

          {/* Editar nombre del grupo */}
          <div className="bg-white rounded-lg w-full mt-4">
            <div className="relative bg-inherit">
              <input
                type="text"
                id="title"
                name="title"
                className="w-full peer bg-transparent h-10 text-xl rounded-lg placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
                placeholder="Nombre del grupo"
                onChange={handleTitle}
                defaultValue={title}
                autoComplete="off"
                required
              />
              <label
                htmlFor="title"
                className="absolute cursor-text left-0 -top-3 text-sm text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all"
              >
                Nombre del grupo
              </label>
            </div>
          </div>
          {/* Editar descripcion del grupo */}
          <div className="bg-white rounded-lg w-full mt-4">
            <div className="relative bg-inherit">
              <input
                type="text"
                id="description"
                name="description"
                className="w-full peer bg-transparent h-10 text-xl rounded-lg placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
                placeholder="Descripción del grupo"
                onChange={handleDescription}
                defaultValue={description}
                autoComplete="off"
              />
              <label
                htmlFor="description"
                className="absolute cursor-text left-0 -top-3 text-sm text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all"
              >
                Descripción
              </label>
            </div>
          </div>
          {/* Editar tipo de grupo */}
          <b>Tipo de grupo</b>
          <ul className="flex w-full flex-col gap-4">
            <div
              className={`block rounded-lg cursor-pointer p-5 border-2 hover:border-blue-500 transition-colors ${
                isPublic ? "border-blue-500 bg-blue-100" : ""
              }`}
              onClick={handlePublicGroup}
            >
              <MdPublic />
              <div className="w-full text-lg font-semibold">Grupo público</div>
              <div className="w-full text-sm">
                Una comunidad abierta para todos. Cualquier persona puede unirse
                y participar.
              </div>
            </div>
            <div
              className={`block rounded-lg cursor-pointer p-5 border-2 hover:border-blue-500 transition-colors ${
                !isPublic ? "border-blue-500 bg-blue-100" : ""
              }`}
              onClick={handlePrivateGroup}
            >
              <RiGitRepositoryPrivateFill />
              <div className="w-full text-lg font-semibold">Grupo privado</div>
              <div className="w-full text-sm">
                Una comunidad cerrada donde solo los miembros invitados pueden
                unirse.
              </div>
            </div>
          </ul>

          {/* Boton para editar el grupo */}
          <button
            type="submit"
            className="w-full cursor-pointer bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            {loader ? (
              <ClipLoader
                color="white"
                size={24}
                cssOverride={{ display: "block", margin: "0 auto" }}
              />
            ) : (
              "Editar Grupo"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditGroupForm;
