export const dbErrorHandler = (error) => {
  if (error.code === "23505") {
    // Violación de UNIQUE
    if (error.constraint === "users_email_key") {
      throw new Error("El email ya está en uso");
    } else if (error.constraint === "users_username_key") {
      throw new Error("El nombre de usuario ya está en uso");
    }
  } else if (error.code === "23514") {
    // Violación de CHECK
    throw new Error("Uno o más valores no cumplen con las restricciones");
  } else if (error.code === "23502") {
    // NOT NULL violation
    throw new Error("Falta un valor obligatorio");
  } else {
    console.error("Error inesperado en la base de datos:", error);
    throw new Error("Error interno del servidor");
  }
};
