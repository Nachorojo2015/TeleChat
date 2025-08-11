import { FaArrowLeft } from "react-icons/fa6";
import { useMenuStore } from "../store/menuStore";
import { CiCamera } from "react-icons/ci";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { editGroup } from "../services/groupsService";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const groupData = {
      title,
      description,
      is_public: isPublic,
      picture
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
    <div className="border-l flex flex-col h-screen w-[30%] relative">
      <header className="flex items-center gap-4 p-4 border-b">
        <FaArrowLeft
          size={24}
          onClick={closeEditGroupForm}
          className="cursor-pointer"
        />
        <b>Editar</b>
      </header>

      <form onSubmit={handleSubmit}>
        <label>
          <div className="relative">
            <img
              src={picture}
              alt="picture-of-group"
              className="object-cover rounded-full m-auto mt-12 w-36 h-36"
              style={{ filter: "brightness(50%)" }}
            />
            <CiCamera
              size={60}
              className="absolute top-10 right-1/2 left-1/2 transform -translate-x-1/2"
              color="white"
            />
          </div>

          <input type="file" hidden accept="image/*" onChange={handlePicture} />
        </label>

        <input
          type="text"
          placeholder="Nombre del grupo"
          defaultValue={title}
          onChange={handleTitle}
        />
        <input
          type="text"
          placeholder="Descripcion"
          defaultValue={description}
          onChange={handleDescription}
        />

        <div className="flex flex-col">
          <p>Tipo de grupo</p>
          <label>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            Grupo público
          </label>
          <label>
            <input
              type="checkbox"
              checked={!isPublic}
              onChange={(e) => setIsPublic(!e.target.checked)}
            />
            Grupo privado
          </label>
        </div>

        <button className="absolute bottom-4 right-0 transform -translate-x-1/2">
          <FaCheck />
        </button>
      </form>
    </div>
  );
};

export default EditGroupForm;
