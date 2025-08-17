import { FaArrowLeft } from "react-icons/fa6";
import { useMenuStore } from "../store/menuStore";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { createGroup } from "../services/groupsService";
import { TbCameraPlus } from "react-icons/tb";
import ClipLoader from "react-spinners/ClipLoader";

const CreateGroupForm = () => {
  const closeCreateGroupForm = useMenuStore(
    (state) => state.closeCreateGroupForm
  );

  const [picture, setPicture] = useState(null);
  const [name, setName] = useState("");
  const [loader, setLoader] = useState(false);

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

    setLoader(true);

    try {
      await createGroup({ title: name, picture });
      closeCreateGroupForm();
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  return (
    <aside className="relative border-r border-slate-50 w-[25%] px-3">
      <nav className="flex items-center gap-6 p-5">
        <button onClick={closeCreateGroupForm} className="cursor-pointer">
          <FaArrowLeft size={24}/>
        </button>
        <h2 className="text-xl font-semibold">Nuevo Grupo</h2>
      </nav>

      <form
        className="flex flex-col items-center justify-center gap-4"
        onSubmit={handleSubmit}
      >
        <label>
          {picture ? (
            <div className="relative cursor-pointer group">
              <img
                src={picture}
                alt="camera"
                className="w-32 h-32 rounded-full object-cover"
                style={{ filter: "brightness(50%)" }}
              />
              <TbCameraPlus
                color="white"
                size={60}
                className="absolute top-8 right-1/2 left-1/2 transform -translate-x-1/2 group-hover:scale-110 transition-transform duration-200"
              />
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full group bg-blue-500 flex items-center justify-center cursor-pointer">
              <TbCameraPlus
                color="white"
                size={60}
                className="group-hover:scale-110 transition-transform duration-200"
              />
            </div>
          )}

          <input
            type="file"
            name="picture"
            accept=".png, .jpg, .jpeg"
            hidden
            onChange={handlePictureChange}
          />
        </label>

        <input
          name="title"
          className="w-full bg-transparent mt-4 placeholder:text-slate-400 text-slate-700 text-lg border border-slate-200 rounded-xl px-3 py-3 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300"
          placeholder="Nombre del grupo"
          onChange={handleNameChange}
          required
        />

        {name ? (
          <button
            type="submit"
            disabled={loader}
            className="absolute bottom-4 right-4 bg-blue-500 text-white p-4 shadow-lg hover:bg-blue-600 transition-colors rounded-full"
          >
            {
              loader ? (
                <ClipLoader size={25} color="white" cssOverride={{display: "flex"}}/>
              ) : (
                <FaArrowRight size={25} />
              )
            }
          </button>
        ) : (
          <></>
        )}
      </form>
    </aside>
  );
};

export default CreateGroupForm;
