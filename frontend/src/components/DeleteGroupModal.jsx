import { forwardRef } from "react";

const DeleteGroupModal = forwardRef(({ group }, ref) => {
  const closeDeleteGroupModal = () => {
    ref.current.close();
  };

  const handleDeleteGroup = () => {
    // Lógica para eliminar el grupo
  };

  return (
    <dialog
      ref={ref}
      className="p-3 rounded-md backdrop:bg-black/50 
             fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <div className="flex items-center gap-3">
        <img
          src={group?.picture}
          alt="picture-of-group"
          className="w-10 h-10 rounded-full object-cover"
        />
        <p className="text-xl font-bold">Eliminar grupo</p>
      </div>

      <p className="mt-4">
        ¿Quieres eliminar <b>{group?.title}</b>?
      </p>

      <div className="flex flex-col items-end mt-4">
        <button className="uppercase text-red-500 p-1 rounded-md transition-all hover:bg-red-50 cursor-pointer" onClick={handleDeleteGroup}>
          Eliminar grupo
        </button>
        <button
          className="uppercase text-blue-500 p-1 rounded-md transition-all hover:bg-blue-50 cursor-pointer"
          onClick={closeDeleteGroupModal}
        >
          Cancelar
        </button>
      </div>
    </dialog>
  );
});

export default DeleteGroupModal;
