import { Outlet } from "react-router-dom";
import Menu from "../components/Menu";

const HomeLayout = () => {
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
