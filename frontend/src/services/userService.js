export const getMyUser = async () => {
  try {
    let response = await fetch(`http://localhost:3000/users/myUser`, {
      credentials: "include", // si usas cookies
    });

    if (response.status === 401) {
      console.warn("Token expirado, intentando refrescar...");

      // Llamada a /refresh para obtener nuevo token
      const refreshRes = await fetch("http://localhost:3000/auth/refresh", {
        method: "POST",
        credentials: "include", // cookies para refresh
      });

      if (!refreshRes.ok) {
        throw new Error("No se pudo refrescar el token");
      }

      // Reintentar la petición original con el nuevo token
      response = await fetch(`http://localhost:3000/users/myUser`, {
        credentials: "include",
      });
    }

    if (!response.ok) {
      throw new Error("Error al obtener los datos de mi usuario");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

export const editProfile = async ({ fullname, bio, picture }) => {
  const formData = new FormData();
  formData.append("displayName", fullname);
  formData.append("bio", bio);
  if (picture) {
    formData.append("profile-picture", picture);
  }

  try {
    let response = await fetch(`http://localhost:3000/users/edit-profile`, {
      method: "PUT",
      credentials: "include",
      body: formData,
    });

    if (response.status === 401) {
      console.warn("Token expirado, intentando refrescar...");

      // Llamada a /refresh para obtener nuevo token
      const refreshRes = await fetch("http://localhost:3000/auth/refresh", {
        method: "POST",
        credentials: "include", // cookies para refresh
      });

      if (!refreshRes.ok) {
        throw new Error("No se pudo refrescar el token");
      }

      // Reintentar la petición original con el nuevo token
      response = await fetch(`http://localhost:3000/users/edit-profile`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });
    }

    if (!response.ok) {
      throw new Error("Error al editar los datos de mi usuario");
    }

    const data = await response.text();
    return data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

export const searchUsersByUsername = async (username) => {
  try {
    let response = await fetch(`http://localhost:3000/users/${username}`, {
      credentials: "include",
    });

    if (response.status === 401) {
      console.warn("Token expirado, intentando refrescar...");

      // Llamada a /refresh para obtener nuevo token
      const refreshRes = await fetch("http://localhost:3000/auth/refresh", {
        method: "POST",
        credentials: "include", // cookies para refresh
      });

      if (!refreshRes.ok) {
        throw new Error("No se pudo refrescar el token");
      }

      // Reintentar la petición original con el nuevo token
      response = await fetch(`http://localhost:3000/users/${username}`, {
        credentials: "include",
      });
    }

    if (!response.ok) {
      throw new Error("Error al editar los datos de mi usuario");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};
