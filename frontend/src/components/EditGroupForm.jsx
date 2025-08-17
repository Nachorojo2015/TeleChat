import { FaArrowLeft } from "react-icons/fa6";
import { useMenuStore } from "../store/menuStore";
import { CiCamera } from "react-icons/ci";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { editGroup } from "../services/groupsService";
import { MdPublic } from "react-icons/md";
import { RiGitRepositoryPrivateFill } from "react-icons/ri";

const EditGroupForm = ({ group, id }) => {
  const { closeEditGroupForm } = useMenuStore();

  const [picture, setPicture] = useState(group?.picture);

  const [title, setTitle] = useState(group?.title || "");

  const [description, setDescription] = useState(group?.description || "");

  const [isPublic, setIsPublic] = useState(group?.isPublic || false);

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleDescription = (e) => {
    setDescription(e.target.value);
  };

  const handlePicture = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublicGroup = () => {
    console.log("Publico");
    setIsPublic(true);
    console.log(isPublic);
  };

  const handlePrivateGroup = () => {
    setIsPublic(false);
    console.log(isPublic);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const groupData = {
      title,
      description,
      is_public: isPublic,
      picture,
    };

    if (picture) {
      groupData.picture = picture;
    }

    try {
      const updatedGroup = await editGroup(id, groupData);
      console.log("Grupo editado:", updatedGroup);
    } catch (error) {
      console.error("Error al editar el grupo:", error);
    }
  };

  return (
    <div className="shadow flex flex-col h-screen w-[40%] relative bg-white">
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
                src={picture}
                alt="picture-of-group"
                className="object-cover rounded-full m-auto w-52 h-52"
                style={{ filter: "brightness(50%)" }}
                accept="image/*"
              />
              <CiCamera
                size={60}
                className="absolute top-20 right-1/2 left-1/2 transform -translate-x-1/2 group-hover:scale-110 transition"
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
          <input
            type="text"
            placeholder="Nombre del grupo"
            defaultValue={title}
            onChange={handleTitle}
            className="w-full bg-transparent mt-4 placeholder:text-slate-400 text-slate-700 text-lg border border-slate-200 rounded-xl px-3 py-3 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300"
          />
          {/* Editar descripcion del grupo */}
          <input
            type="text"
            placeholder="Descripcion"
            defaultValue={description}
            onChange={handleDescription}
            className="w-full bg-transparent mt-4 placeholder:text-slate-400 text-slate-700 text-lg border border-slate-200 rounded-xl px-3 py-3 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300"
          />

          {/* Editar tipo de grupo */}
          <b>Tipo de grupo</b>
          <ul class="flex w-full flex-col gap-4">
            <div className={`block rounded-lg cursor-pointer p-5 border-2 hover:border-blue-500 transition-colors ${isPublic ? "border-blue-500" : ""}`} onClick={handlePublicGroup}>
              <MdPublic />
              <div className="w-full text-lg font-semibold">Grupo público</div>
              <div className="w-full text-sm">
                Una comunidad abierta para todos. Cualquier persona puede unirse
                y participar.
              </div>
            </div>
            <div className={`block rounded-lg cursor-pointer p-5 border-2 hover:border-blue-500 transition-colors ${!isPublic ? "border-blue-500" : ""}`} onClick={handlePrivateGroup}>
              <RiGitRepositoryPrivateFill />
              <div className="w-full text-lg font-semibold">Grupo privado</div>
              <div className="w-full text-sm">
                Una comunidad cerrada donde solo los miembros invitados pueden
                unirse.
              </div>
            </div>
          </ul>
        </form>
      </div>
    </div>
  );
};

export default EditGroupForm;
