import { Link } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm.jsx";
import { TbLocationFilled } from "react-icons/tb";

const Login = () => {
  return (
    <div class="flex flex-col justify-center h-[100dvh] px-5">
      <div>
        <TbLocationFilled size={50} className="mx-auto text-blue-500" />
        <h2 class="mt-2 text-center text-2xl/9 font-bold tracking-tight">
          Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm">Please enter your username and password</p>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <LoginForm />

        <p class="mt-3 text-center text-sm/6 text-gray-400">
          Dont have an account?{" "}
          <Link
            to="/register"
            class="font-medium text-blue-500 hover:underline"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
