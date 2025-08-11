import { Link, useNavigate } from "react-router-dom";
import { useRegisterForm } from "../../hooks/auth/useRegisterForm";
import { register } from "../../services/auth/authService";
import { isValidPassword } from "../../utils/isValidPassword";

const RegisterhtmlForm = () => {
  const { formData, handleChange } = useRegisterForm();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const isValid = isValidPassword(formData.password);

    if (!isValid) {
      alert(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    try {
      await register(
        formData.username,
        formData.email,
        formData.password,
        formData.fullname
      );
      alert("User registered successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium"
        >
          Your email
        </label>
        <input
          type="email"
          name="email"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          placeholder="name@company.com"
          required
          onChange={handleChange}
        />
      </div>
      <div>
        <label
          htmlFor="username"
          className="block mb-2 text-sm font-medium"
        >
          Your username
        </label>
        <input
          type="text"
          name="username"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          placeholder="Username"
          required
          onChange={handleChange}
        />
      </div>
      <div>
        <label
          htmlFor="fullname"
          className="block mb-2 text-sm font-medium"
        >
          Your fullname
        </label>
        <input
          type="text"
          name="fullname"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          placeholder="Full Name"
          required
          onChange={handleChange}
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          required
          onChange={handleChange}
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
          type="confirm-password"
          name="confirmPassword"
          placeholder="••••••••"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          required
          onChange={handleChange}
        />
      </div>
      <button
        type="submit"
        className="w-full font-medium bg-blue-500 text-white rounded-lg text-sm px-5 py-2.5 text-center"
      >
        Create an account
      </button>
    </form>
  );
};

export default RegisterhtmlForm;
