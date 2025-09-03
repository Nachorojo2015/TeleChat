import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { useMenuStore } from "../store/menuStore";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { TbCameraPlus } from "react-icons/tb";
import { editProfile } from "../services/userService";
import { useUserStore } from "../store/userStore";

const EditProfileForm = () => {
  const { user, setUser } = useUserStore();
  const [picture, setPicture] = useState(null);
  const [picturePreview, setPicturePreview] = useState(
    user?.profile_picture || null
  );
  const [fullname, setFullname] = useState(user?.display_name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [loader, setLoader] = useState(false);

  const { closeEditProfileForm } = useMenuStore();

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

      setUser({
        ...user,
        display_name: fullname,
        bio,
        profile_picture: picturePreview || user.profile_picture,
      });
    } catch (error) {
      console.error("Error al editar perfil:", error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <aside className="relative border-r border-slate-50 xl:w-[25%] w-full px-3">
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

        <div className="bg-white rounded-lg w-full mt-4">
          <div className="relative bg-inherit">
            <input
              type="text"
              id="fullname"
              name="fullname"
              className="w-full peer bg-transparent h-10 text-xl rounded-lg placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
              placeholder="Nombre completo"
              onChange={handleFullnameChange}
              defaultValue={fullname}
              autoComplete="off"
              required
            />
            <label
              htmlFor="fullname"
              className="absolute cursor-text left-0 -top-3 text-sm text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all"
            >
              Nombre completo
            </label>
          </div>
        </div>

        <div className="bg-white rounded-lg w-full mt-4">
          <div className="relative bg-inherit">
            <input
              type="text"
              id="bio"
              name="bio"
              className="w-full peer bg-transparent h-10 text-xl rounded-lg placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
              placeholder="Biografía"
              onChange={handleBioChange}
              defaultValue={bio}
              autoComplete="off"
              required
            />
            <label
              htmlFor="bio"
              className="absolute cursor-text left-0 -top-3 text-sm text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all"
            >
              Biografía
            </label>
          </div>
        </div>

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
