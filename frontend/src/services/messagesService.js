export const getMessages = async (chatId) => {
  try {
    let response = await fetch(`http://localhost:3000/messages/${chatId}`, {
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
      response = await fetch(`http://localhost:3000/messages/${chatId}`, {
        credentials: "include",
      });
    }

    if (!response.ok) {
      throw new Error("Error al obtener los mensajes");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

export const sendMessage = async ({
  chatId,
  content,
  type,
  file,
}) => {
  
  const formData = new FormData();
  formData.append("content", content);
  formData.append("type", type);

  if (file) {
    formData.append("file", file);
  }

  try {
    let response = await fetch(
      `http://localhost:3000/messages/create/${chatId}`,
      {
        method: "POST",
        body: formData,
        credentials: "include", // si usas cookies para auth
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
        `http://localhost:3000/messages/create/${chatId}`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );
    }

    if (!response.ok) {
      const info = await response.json();
      console.error("Error details:", info);
      throw new Error("Error al enviar el mensaje");
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
