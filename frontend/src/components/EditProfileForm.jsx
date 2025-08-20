import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { useMenuStore } from "../store/menuStore";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { TbCameraPlus } from "react-icons/tb";
import { editProfile } from "../services/userService";

const EditProfileForm = ({ myUser }) => {
  const [picture, setPicture] = useState(null);
  const [picturePreview, setPicturePreview] = useState(myUser?.profile_picture || null); 
  const [fullname, setFullname] = useState(myUser?.display_name || "");
  const [bio, setBio] = useState(myUser?.bio || "");
  const [loader, setLoader] = useState(false);

  const { closeEditProfileForm } = useMenuStore();

  console.log(picture)

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

  const handleFullnameChange = (e) => {
    const name = e.target.value;
    setFullname(name);
  };

  const handleBioChange = (e) => {
    const bio = e.target.value;
    setBio(bio);
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();

    setLoader(true);

    try {
      await editProfile({ fullname, bio, picture });
      closeEditProfileForm();
    } catch (error) {
      console.error("Error al editar perfil:", error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <aside className="relative border-r border-slate-50 w-[25%] px-3">
      <nav className="flex items-center gap-6 p-5">
        <button onClick={closeEditProfileForm} className="cursor-pointer">
          <FaArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-semibold">Editar perfil</h2>
      </nav>

      <form
        className="flex flex-col items-center justify-center gap-4"
        onSubmit={handleEditProfile}
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
            name="profile-picture"
            accept=".png, .jpg, .jpeg"
            hidden
            onChange={handlePictureChange}
          />
        </label>

        <input
          type="text"
          name="fullname"
          className="w-full bg-transparent mt-4 placeholder:text-slate-400 text-slate-700 text-lg border border-slate-200 rounded-xl px-3 py-3 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300"
          placeholder="Nombre completo"
          defaultValue={fullname}
          onChange={handleFullnameChange}
          required
        />

        <input
          type="text"
          name="bio"
          defaultValue={bio}
          placeholder="Biografía"
          onChange={handleBioChange}
          className="w-full bg-transparent mt-2 placeholder:text-slate-400 text-slate-700 text-lg border border-slate-200 rounded-xl px-3 py-3 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300"
        />

        <p className="text-slate-400 text-center">
          Datos como la edad, ocupación o ciudad. Ejemplo: Diseñador de Chicago.
          23 años.
        </p>

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
      </form>
    </aside>
  );
};

export default EditProfileForm;
