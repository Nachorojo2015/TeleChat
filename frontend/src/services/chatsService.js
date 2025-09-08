import api from "../api/api";

export const getChats = async () => {
  const { data } = await api.get("/chats");
  return data;
};

export const deleteChat = async (chatId) => {
  const { data } = await api.delete(`/chats/${chatId}`);
  return data;
}