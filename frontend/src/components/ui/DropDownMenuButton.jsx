import { useMenuStore } from "../../store/menuStore";
import { useUserStore } from "../../store/userStore";
import { GiHamburgerMenu } from "react-icons/gi";
import CloseSessionButton from "../CloseSessionButton";

const DropDownMenuButton = () => {
  const openEditProfileForm = useMenuStore(
    (state) => state.openEditProfileForm
  );
  const { user } = useUserStore();

  return (
    <div className="dropdown dropdown-start">
      <div tabIndex={0} role="button" className="btn btn-ghost m-1">
        <GiHamburgerMenu size={25} />
      </div>
      <ul
        tabIndex="-1"
        className="dropdown-content menu rounded-box z-1 w-52 p-2 shadow-sm bg-white"
      >
        <button
          className="w-full flex items-center gap-4 px-4 py-2 cursor-pointer hover:bg-gray-100"
          onClick={openEditProfileForm}
        >
          <img
            src={user?.profile_picture}
            className="w-8 h-8 rounded-full object-cover"
            alt="profile-picture"
          />
          <span>{user?.display_name}</span>
        </button>
        <CloseSessionButton />
      </ul>
    </div>
  );
};

export default DropDownMenuButton;
