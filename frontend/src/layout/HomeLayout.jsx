import { Outlet } from "react-router-dom"
import Menu from "../components/Menu"

const HomeLayout = () => {
  return (
    <section className="flex h-[100dvh] overflow-hidden">
      <Menu />

      <Outlet />
    </section>
  )
}

export default HomeLayout