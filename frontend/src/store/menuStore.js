import { create } from "zustand";

export const useMenuStore = create((set) => ({
  // Menu de creación de grupos
  isOpenCreateGroupForm: false,
  closeCreateGroupForm: () => set({ isOpenCreateGroupForm: false }),
  openCreateGroupForm: () => set({ isOpenCreateGroupForm: true }),

  // Menu para ver información del grupo
  isOpenInfoGroup: false,
  closeInfoGroup: () => set({ isOpenInfoGroup: false }),
  openInfoGroup: () => set({ isOpenInfoGroup: true }),

  // Menu para editar un grupo
  isOpenEditGroupForm: false,
  closeEditGroupForm: () => set({ isOpenEditGroupForm: false }),
  openEditGroupForm: () => set({ isOpenEditGroupForm: true }),

  // Menu para editar el perfil del usuario
  isOpenEditProfileForm: false,
  closeEditProfileForm: () => set({ isOpenEditProfileForm: false }),
  openEditProfileForm: () => set({ isOpenEditProfileForm: true }),

  // Menu para buscar chats
  isOpenSearchChats: false,
  closeSearchChats: () => set({ isOpenSearchChats: false }),
  openSearchChats: () => set({ isOpenSearchChats: true }),

  // Menu para ver información del chat privado
  isOpenInfoPrivateChat: false,
  closeInfoPrivateChat: () => set({ isOpenInfoPrivateChat: false }),
  openInfoPrivateChat: () => set({ isOpenInfoPrivateChat: true }),
}));