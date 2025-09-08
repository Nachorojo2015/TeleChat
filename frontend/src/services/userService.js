import api from "../api/api";

export const getMyUser = async () => {
  const { data } = await api.get("/users/myUser");
  return data;
};

export const editProfile = async ({ fullname, bio, picture }) => {
  const formData = new FormData();
  formData.append("displayName", fullname);
  formData.append("bio", bio);
  if (picture) {
    formData.append("profile-picture", picture);
  }

  const { data } = await api.put("/users/edit-profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const searchUsersByUsername = async (username) => {
  const { data } = await api.get(`/users/${username}`);
  return data;
};
