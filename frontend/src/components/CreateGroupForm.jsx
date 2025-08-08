import { FaArrowLeft } from "react-icons/fa6";
import { useMenuStore } from "../store/menuStore";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { createGroup } from "../services/groupsService";

const CreateGroupForm = () => {
  const closeCreateGroupForm = useMenuStore(
    (state) => state.closeCreateGroupForm
  );

  const [picture, setPicture] = useState(
    "https://pngimg.com/d/photo_camera_PNG101641.png"
  );
  const [name, setName] = useState("");

  const handlePictureChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setName(name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createGroup({ title: name, picture });
      closeCreateGroupForm();
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  return (
    <aside className="relative border-r w-[30%]">
      <nav className="flex items-center gap-4">
        <FaArrowLeft onClick={closeCreateGroupForm} />
        <h2 className="text-lg font-bold">Nuevo Grupo</h2>
      </nav>

      <form className="flex flex-col items-center justify-center gap-4" onSubmit={handleSubmit}>
        <label>
          <img
            src={picture}
            alt="camera"
            className="w-16 h-16 rounded-full object-cover cursor-pointer"
          />

          <input
            type="file"
            name="picture"
            accept=".png, .jpg, .jpeg"
            hidden
            onChange={handlePictureChange}
          />
        </label>

        <input
          type="text"
          name="title"
          placeholder="Nombre del grupo"
          onChange={handleNameChange}
          required
        />

        {name ? (
          <button
            type="submit"
            className="absolute bottom-4 right-4 bg-blue-500 text-white p-3 shadow-lg hover:bg-blue-600 transition-colors rounded-full"
          >
            <FaArrowRight />
          </button>
        ) : (
          <></>
        )}
      </form>
    </aside>
  );
};

export default CreateGroupForm;
