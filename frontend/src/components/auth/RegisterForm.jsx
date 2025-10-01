import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth/authService";
import { isValidPassword } from "../../utils/isValidPassword";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form"

const RegisterhtmlForm = () => {
  const [loader, setLoader] = useState(false);

  const { register, handleSubmit } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const isValid = isValidPassword(data.password);

    if (!isValid) {
      toast.error(
        "Las contraseñas deben tener al menos 8 caracteres, incluyendo una letra mayúscula, una letra minúscula, un número y un carácter especial."
      );
      return;
    }

    setLoader(true);

    try {
      await registerUser(
        data.username,
        data.email,
        data.password,
        data.fullname
      );
      toast.success("Registro exitoso! Por favor, inicia sesión.");
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data || "Registro fallido. Inténtalo de nuevo."
      );
    } finally {
      setLoader(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email" className="block mb-2 text-sm font-medium">
          Your email
        </label>
        <input
          type="email"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          placeholder="name@company.com"
          { ...register("email", { required: true }) }
        />
      </div>
      <div>
        <label htmlFor="username" className="block mb-2 text-sm font-medium">
          Your username
        </label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          placeholder="Username"
          { ...register("username", { required: true }) }
        />
      </div>
      <div>
        <label htmlFor="fullname" className="block mb-2 text-sm font-medium">
          Your fullname
        </label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          placeholder="Full Name"
          { ...register("fullname", { required: true }) }
        />
      </div>
      <div>
        <label htmlFor="password" className="block mb-2 text-sm font-medium">
          Password
        </label>
        <input
          type="password"
          placeholder="••••••••"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          { ...register("password", { required: true }) }
        />
      </div>
      <div>
        <label
          htmlFor="confirmPassword"
          className="block mb-2 text-sm font-medium"
        >
          Confirm password
        </label>
        <input
          placeholder="••••••••"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          { ...register("confirmPassword", { required: true }) }
        />
      </div>
      <button
        type="submit"
        disabled={loader}
        className="w-full cursor-pointer font-medium bg-blue-500 text-white rounded-lg text-sm px-5 py-2.5 text-center"
      >
        {loader ? (
          <ClipLoader
            size={24}
            color="white"
            cssOverride={{ display: "block", margin: "0 auto" }}
          />
        ) : (
          "Create an account"
        )}
      </button>
    </form>
  );
};

export default RegisterhtmlForm;
