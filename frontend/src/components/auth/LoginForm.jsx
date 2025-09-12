import { useNavigate } from "react-router-dom";
import { useLoginForm } from "../../hooks/auth/useLoginForm";
import { login } from "../../services/auth/authService";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import toast from "react-hot-toast";

const LoginForm = () => {
  const { formData, handleChange } = useLoginForm();
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoader(true);

    try {
      await login(formData.username, formData.password);
      navigate("/"); // Redirect to home or dashboard
    } catch (error) {
      toast.error(error.response?.data || "Login fallido. Inténtalo de nuevo.");
      setLoader(false);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        required
        name="username"
        value={formData.username}
        onChange={handleChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
      />
      <input
        type="password"
        placeholder="Password"
        required
        name="password"
        value={formData.password}
        onChange={handleChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
      />
      <button
        type="submit"
        disabled={loader}
        className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer"
      >
        {
          loader ? <ClipLoader size={24} color="white" cssOverride={{display: 'block', margin: '0 auto'}}/> : "Login"
        }
      </button>
    </form>
  );
};

export default LoginForm;
