import api from "../api/api";

export const getMessages = async (chatId) => {
  const { data } = await api.get(`/messages/${chatId}`);
  return data;
};

export const sendMessage = async ({ chatId, content, type, file }) => {
  const formData = new FormData();
  formData.append("content", content);
  formData.append("type", type);

  if (file) {
    formData.append("file", file);
  }

  const { data } = await api.post(`/messages/create/${chatId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data.message;
};
