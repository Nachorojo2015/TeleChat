import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { useMenuStore } from "../store/menuStore";
import { useState } from "react";
import { createChannel } from "../services/channelsService";
import { TbCameraPlus } from "react-icons/tb";
import ClipLoader from "react-spinners/ClipLoader";

const CreateChannelForm = () => {
  const { closeCreateChannelForm } = useMenuStore();

  const [picture, setPicture] = useState(null);
  const [picturePreview, setPicturePreview] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loader, setLoader] = useState(false);

  const handlePictureChange = (e) => {
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

  const handleNameChange = (e) => {
    const name = e.target.value;
    setName(name);
  };

  const handleDescriptionChange = (e) => {
    const description = e.target.value;
    setDescription(description);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoader(true);

    try {
      await createChannel({ title: name, description, picture });
      closeCreateChannelForm();
    } catch (error) {
      console.error("Error creating channel:", error);
    }
  };

  return (
    <aside className="relative border-r border-slate-50 xl:w-[25%] w-full px-3">
      <nav className="flex items-center gap-6 p-5">
        <button onClick={closeCreateChannelForm} className="cursor-pointer">
          <FaArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-semibold">Nuevo Canal</h2>
      </nav>

      <form
        className="flex flex-col items-center justify-center gap-4"
        onSubmit={handleSubmit}
      >
        <label>
          {picturePreview ? (
            <div className="relative cursor-pointer group">
              <img
                src={picturePreview}
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

        <div className="bg-white rounded-lg w-full mt-4">
          <div className="relative bg-inherit">
            <input
              type="text"
              id="title"
              name="title"
              className="w-full peer bg-transparent h-10 text-xl rounded-lg placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
              placeholder="Nombre del canal"
              onChange={handleNameChange}
              autoComplete="off"
              required
            />
            <label
              htmlFor="title"
              className="absolute cursor-text left-0 -top-3 text-sm text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all"
            >
              Nombre del canal
            </label>
          </div>
        </div>

        <div className="bg-white rounded-lg w-full mt-4">
          <div className="relative bg-inherit">
            <input
              type="text"
              id="description"
              name="description"
              className="w-full peer bg-transparent h-10 text-xl rounded-lg placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
              placeholder="Descripcion (Opcional)"
              onChange={handleDescriptionChange}
              autoComplete="off"
              required
            />
            <label
              htmlFor="description"
              className="absolute cursor-text left-0 -top-3 text-sm text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all"
            >
              Descripcion (Opcional)
            </label>
          </div>
        </div>

        <p className="text-slate-400">
          Puedes poner una descripción para tu canal.
        </p>

        {name ? (
          <button
            type="submit"
            disabled={loader}
            className="absolute bottom-4 right-4 bg-blue-500 text-white p-4 shadow-lg hover:bg-blue-600 transition-colors rounded-full"
          >
            {loader ? (
              <ClipLoader
                size={25}
                color="white"
                cssOverride={{ display: "flex" }}
              />
            ) : (
              <FaArrowRight size={25} />
            )}
          </button>
        ) : (
          <></>
        )}
      </form>
    </aside>
  );
};

export default CreateChannelForm;
