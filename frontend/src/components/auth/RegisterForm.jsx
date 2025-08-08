import { useRegisterForm } from "../../hooks/auth/useRegisterForm";
import { register } from "../../services/auth/authService";
import { isValidPassword } from "../../utils/isValidPassword";

const RegisterForm = () => {
  const { formData, handleChange } = useRegisterForm();

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
      window.location.href = "/login";
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        placeholder="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        placeholder="Fullname"
        name="fullname"
        value={formData.fullname}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        placeholder="Password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer"
      >
        Register
      </button>
    </form>
  );
};

export default RegisterForm;
