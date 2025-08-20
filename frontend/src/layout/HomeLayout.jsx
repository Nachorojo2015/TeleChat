import { Outlet, useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import { useEffect } from "react";
import { getMyUser } from "../services/userService";
import { useUserStore } from "../store/userStore";

const HomeLayout = () => {
  const { setUser } = useUserStore();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyUserData = async () => {
      try {
        const data = await getMyUser();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login"); // Redirigir a login si hay un error
      }
    };

    fetchMyUserData();
  }, [navigate, setUser]);

  return (
    <section className="flex h-[100dvh] overflow-hidden">
      <Menu />

      <section className="flex w-[75%] bg-contain bg-[url(/background-chat.png)]">
        <Outlet />
      </section>
    </section>
  );
};

export default HomeLayout;
