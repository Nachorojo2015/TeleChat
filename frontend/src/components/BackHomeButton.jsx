import { FaArrowLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";

const BackHomeButton = () => {
  return (
    <Link to={"/"} className="transition p-2 rounded-full hover:bg-slate-200">
      <FaArrowLeft color="black"/>
    </Link>
  );
};

export default BackHomeButton;
