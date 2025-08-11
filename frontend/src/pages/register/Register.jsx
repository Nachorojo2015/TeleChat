import { Link } from "react-router-dom";
import RegisterForm from "../../components/auth/RegisterForm";
import { TbLocationFilled } from "react-icons/tb";

const Register = () => {
  return (
    <section className="flex flex-col items-center justify-center px-5 h-[100dvh]">
      <div className="w-full xl:max-w-md bg-white">
        <div>
          <TbLocationFilled size={50} className="mx-auto text-blue-500" />
          <h1 className="text-3xl text-center font-bold leading-tight tracking-tight">
            Sign Up
          </h1>
          <RegisterForm />
          <p className="text-sm font-light text-center mt-2 text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-500 hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;
