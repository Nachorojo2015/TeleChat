import { useLocation } from 'react-router-dom';

const Aside = ({ children }) => {

  const location = useLocation();
  const chatId = location.pathname.split("/").pop();
    
  return (
    <aside className={`relative border-r flex flex-col border-slate-50 xl:w-[25%] xl:flex w-full ${
        chatId ? "hidden" : "flex"
      } group`}>
        {children}
    </aside>
  )
}

export default Aside