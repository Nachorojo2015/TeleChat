export const createGroup = async (groupData) => {
  try {
    // Crear el formulario
    const formData = new FormData();
    Object.entries(groupData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Primera petición
    let response = await fetch("http://localhost:3000/groups/create", {
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
      response = await fetch("http://localhost:3000/groups/create", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
    }

    if (!response.ok) {
      throw new Error("Error al crear el grupo");
    }

    const data = await response.json();
    console.log("Group created:", data);
    return data;
  } catch (error) {
    console.error("Error creating group:", error);
    throw error;
  }
};

export const getGroup = async (groupId) => {
  try {
    const response = await fetch(
      `http://localhost:3000/groups/group/${groupId}`,
      {
        credentials: "include", // si usas cookies
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener el grupo");
    }

    const data = await response.json();
    console.log("Group data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching group:", error);
    throw error;
  }
};

export const getMembers = async (groupId) => {
  try {
    let response = await fetch(
      `http://localhost:3000/groups/members/${groupId}`,
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
        `http://localhost:3000/groups/members/${groupId}`,
        {
          credentials: "include",
        }
      );
    }

    if (!response.ok) {
      const info = await response.json();
      console.error("Error details:", info);
      throw new Error("Error al obtener los miembros del grupo");
    }

    const data = await response.json();
    console.log("Members data:", data);
    return data.members;
  } catch (error) {
    console.error("Error fetching members:", error);
    throw error;
  }
};
