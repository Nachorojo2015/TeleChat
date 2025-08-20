import { Outlet, useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import { useEffect } from "react";
import { getMyUser } from "../services/userService";
import { useState } from "react";

const HomeLayout = () => {
  const [myUser, setMyUsername] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyUserData = async () => {
      try {
        const data = await getMyUser();
        setMyUsername(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login"); // Redirigir a login si hay un error
      }
    };

    fetchMyUserData();
  }, [navigate]);

  return (
    <section className="flex h-[100dvh] overflow-hidden">
      <Menu myUser={myUser} />

      <section className="flex w-[75%] bg-contain bg-[url(/background-chat.png)]">
        <Outlet context={{ myUser }} />
      </section>
    </section>
  );
};

export default HomeLayout;
