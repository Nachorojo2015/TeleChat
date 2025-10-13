import { useLocation } from 'react-router-dom';

const Aside = ({ children }) => {

  const location = useLocation();
  const chatId = location.pathname.split("/").pop();
    
  return (
    <aside className={`relative flex flex-col xl:w-[25%] xl:flex w-full bg-white ${
        chatId ? "hidden" : "flex"
      } group`}>
        {children}
    </aside>
  )
}

export default Aside