export const createPrivateChat = async (privateUserId) => {
  try {
    let response = await fetch(
      `http://localhost:3000/privates/create/${privateUserId}`,
      {
        method: "POST",
        credentials: "include", // si usas cookies
      }
    );

    if (response.status === 401) {
      console.warn("Token expirado, intentando refrescar...");

      // Llamar a /refresh
      const refreshRes = await fetch("http://localhost:3000/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!refreshRes.ok) {
        throw new Error("No se pudo refrescar el token");
      }

      // Reintentar la petición con el nuevo token
      response = await fetch(
        `http://localhost:3000/privates/create/${privateUserId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
    }

    if (!response.ok) {
      const info = await response.text();
      console.error("Error details:", info);
      throw new Error("Error al buscar el grupo");
    }

    const data = await response.text();
    return data;
  } catch (error) {
    console.error("Error fetching members:", error);
    throw error;
  }
};

export const getPrivateChat = async (chatId) => {
  try {
    let response = await fetch(
      `http://localhost:3000/privates/private/${chatId}`,
      {
        credentials: "include", // si usas cookies
      }
    );

    if (response.status === 401) {
      console.warn("Token expirado, intentando refrescar...");

      // Llamar a /refresh
      const refreshRes = await fetch("http://localhost:3000/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!refreshRes.ok) {
        throw new Error("No se pudo refrescar el token");
      }

      // Reintentar la petición con el nuevo token
      response = await fetch(
        `http://localhost:3000/privates/private/${chatId}`,
        {
          credentials: "include",
        }
      );
    }

    if (!response.ok) {
      const info = await response.text();
      console.error("Error details:", info);
      throw new Error("Error al buscar el chat privado");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching members:", error);
    throw error;
  }
};

export const deletePrivateChat = async (chatId) => {
  try {
    let response = await fetch(
      `http://localhost:3000/privates/delete/${chatId}`,
      {
        method: "DELETE",
        credentials: "include", // si usas cookies
      }
    );

    if (response.status === 401) {
      console.warn("Token expirado, intentando refrescar...");

      // Llamar a /refresh
      const refreshRes = await fetch("http://localhost:3000/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!refreshRes.ok) {
        throw new Error("No se pudo refrescar el token");
      }

      // Reintentar la petición con el nuevo token
      response = await fetch(
        `http://localhost:3000/privates/delete/${chatId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
    }

    if (!response.ok) {
      const info = await response.text();
      console.error("Error details:", info);
      throw new Error("Error al eliminar el chat privado");
    }

    const data = await response.text();
    return data;
  } catch (error) {
    console.error("Error fetching members:", error);
    throw error;
  }
};
