import { Outlet } from "react-router-dom";
import Menu from "../components/Menu";
import { useEffect } from "react";
import { getMyUser } from "../services/userService";
import { useState } from "react";

const HomeLayout = () => {

  const [myUser, setMyUsername] = useState(null);

  useEffect(() => {
    const fetchMyUserData = async () => {
      const data = await getMyUser();
      setMyUsername(data);
    }

    fetchMyUserData();
  }, [])
  

  return (
    <section className="flex h-[100dvh] overflow-hidden">
      <Menu />

      <section className="flex w-[75%] bg-contain bg-[url(/background-chat.png)]">
        <Outlet context={{ myUser }} />
      </section>
    </section>
  );
};

export default HomeLayout;
