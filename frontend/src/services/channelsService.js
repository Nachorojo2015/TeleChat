export const createChannel = async (channelData) => {
  try {
    // Crear el formulario
    const formData = new FormData();
    Object.entries(channelData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Primera petición
    let response = await fetch("http://localhost:3000/channels/create", {
      method: "POST",
      body: formData,
      credentials: "include", // si usas cookies para auth
    });

    // Si el token expiró
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
      response = await fetch("http://localhost:3000/channels/create", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
    }

    if (!response.ok) {
      throw new Error("Error al crear el canal");
    }

    const data = await response.json();
    console.log("Channel created:", data);
    return data;
  } catch (error) {
    console.error("Error creating channel:", error);
    throw error;
  }
};
