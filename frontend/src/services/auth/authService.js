import api from "../../api/api";

export const loginUser = async (username, password) => {
  const { data } = await api.post("/auth/login", {
    username,
    password,
  });
  
  return data;
};

export const registerUser = async (username, email, password, displayName) => {
  const { data } = await api.post("/auth/register", {
    username,
    email,
    password,
    display_name: displayName,
  });
  
  return data;
};

export const logout = async () => {
  await api.delete("/auth/logout");
  return true;
}
