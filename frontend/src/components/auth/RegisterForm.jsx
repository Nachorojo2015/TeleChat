import { useRegisterForm } from "../../hooks/auth/useRegisterForm";

const RegisterForm = () => {
  const { formData, handleChange, handleSubmit } = useRegisterForm();

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
