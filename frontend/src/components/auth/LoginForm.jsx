import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/auth/authService";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

const LoginForm = () => {
  const [loader, setLoader] = useState(false);

  const { register, handleSubmit } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoader(true);

    try {
      await loginUser(data.username, data.password);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data || "Login fallido. Inténtalo de nuevo.");
    } finally {
      setLoader(false);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <input
        placeholder="Username"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
        {...register("username", { required: true })}
      />
      <input
        type="password"
        placeholder="Password"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
        {...register("password", { required: true })}
      />
      <button
        type="submit"
        disabled={loader}
        className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer"
      >
        {loader ? (
          <ClipLoader
            size={24}
            color="white"
            cssOverride={{ display: "block", margin: "0 auto" }}
          />
        ) : (
          "Login"
        )}
      </button>
    </form>
  );
};

export default LoginForm;
