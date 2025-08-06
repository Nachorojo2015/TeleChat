import { useLoginForm } from "../../hooks/auth/useLoginForm";

const LoginForm = () => {
  const { formData, handleChange, handleSubmit } = useLoginForm();

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        required
        name="username"
        value={formData.username}
        onChange={handleChange}
      />
      <input
        type="password"
        placeholder="Password"
        required
        name="password"
        value={formData.password}
        onChange={handleChange}
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
