export const getChats = async () => {
  try {
    let response = await fetch("http://localhost:3000/chats", {
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
      response = await fetch("http://localhost:3000/chats", {
        credentials: "include",
      });
    }

    if (!response.ok) {
      throw new Error("Error al obtener los chats");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching chats:", error);
    throw error;
  }
};