import { useNavigate } from "react-router-dom";
import { useLoginForm } from "../../hooks/auth/useLoginForm";
import { login } from "../../services/auth/authService";

const LoginForm = () => {
  const { formData, handleChange } = useLoginForm();

  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.username, formData.password);
      navigate("/"); // Redirect to home or dashboard
    } catch (error) {
      console.error("Login error:", error);
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
        className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
