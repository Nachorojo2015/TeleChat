import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { useMenuStore } from "../store/menuStore";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { TbCameraPlus } from "react-icons/tb";
import { editProfile } from "../services/userService";
import { useUserStore } from "../store/userStore";
import toast from "react-hot-toast";
import Aside from "./ui/Aside";
import { useForm } from "react-hook-form";

const EditProfileForm = () => {
  const { user, setUser } = useUserStore();
  const { closeEditProfileForm } = useMenuStore();

  const [loader, setLoader] = useState(false);

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      fullname: user?.display_name,
      bio: user?.bio,
      picture: null,
    }
  });

  const picture = watch("picture");
  
  const [preview, setPreview] = useState(user?.profile_picture || null);

  useEffect(() => {
    if (picture && picture.length > 0) {
      const file = picture[0];
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  }, [picture])

  const onSubmit = async (data) => {
    setLoader(true);

    try {
      await editProfile({ fullname: data.fullname, bio: data.bio, picture });

      setUser({
        ...user,
        display_name: data.fullname,
        bio: data.bio,
        profile_picture: preview || user.profile_picture,
      });

      toast.success("Perfil actualizado con éxito");
    } catch {
      toast.error("Error al actualizar el perfil. Inténtalo de nuevo.");
    } finally {
      setLoader(false);
    }
  };

  return (
    <Aside>
      <nav className="flex items-center gap-6 p-2">
        <button onClick={closeEditProfileForm} className="cursor-pointer transition-colors hover:bg-slate-200 p-2 rounded-full">
          <FaArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-semibold">Editar perfil</h2>
      </nav>

      <form
        className="flex flex-col items-center justify-center gap-4 px-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label>
          {preview ? (
            <div className="relative cursor-pointer group">
              <img
                src={preview}
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
            accept=".png, .jpg, .jpeg"
            hidden
            { ...register("picture") }
          />
        </label>

        <div className="bg-white rounded-lg w-full mt-4">
          <div className="relative bg-inherit">
            <input
              id="fullname"
              name="fullname"
              className="w-full peer bg-transparent h-10 text-xl rounded-lg placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
              placeholder="Nombre completo"
              autoComplete="off"
              { ...register("fullname", { required: true } ) }
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
              id="bio"
              name="bio"
              className="w-full peer bg-transparent h-10 text-xl rounded-lg placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
              placeholder="Biografía"
              autoComplete="off"
              { ...register("bio") }
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
    </Aside>
  );
};

export default EditProfileForm;
