import api from "../api/api";

export const createGroup = async (groupData) => {
  const formData = new FormData();
  Object.entries(groupData).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const { data } = await api.post("/groups/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data", // axios lo infiere, pero es buena práctica
    },
  });

  return data;
};

export const getGroup = async (groupId) => {
  const { data } = await api.get(`/groups/group/${groupId}`);
  return data;
};

export const getMembers = async (groupId) => {
  const { data } = await api.get(`/groups/members/${groupId}`);
  return data.members;
};

export const editGroup = async (groupId, groupData) => {
  const formData = new FormData();
  formData.append("title", groupData.title);
  formData.append("description", groupData.description);
  formData.append("is_public", groupData.is_public);
  if (groupData.picture) {
    formData.append("picture", groupData.picture);
  }

  const { data } = await api.put(`/groups/edit/${groupId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const searchGroupsByName = async (name) => {
  const { data } = await api.get(`/groups/${name}`);
  return data;
};

export const joinGroup = async (groupId) => {
  const { data } = await api.post(`/groups/join/${groupId}`);
  return data;
};

export const leaveGroup = async (groupId) => {
  const { data } = await api.delete(`/groups/out/${groupId}`);
  return data;
};
