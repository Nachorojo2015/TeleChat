import api from "../api/api";

export const createPrivateChat = async (privateUserId) => {
  const { data } = await api.post(`/privates/create/${privateUserId}`)
  return data;
};

export const getPrivateChat = async (chatId) => {
  const { data } = await api.get(`/privates/private/${chatId}`)
  return data;
};
