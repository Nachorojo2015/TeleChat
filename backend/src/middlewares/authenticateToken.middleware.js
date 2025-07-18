import jwt from "jsonwebtoken";
import { SECRET_JWT_KEY } from "../config/variables.js";

export const authenticateToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ message: "Token de acceso no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_JWT_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error de autenticación:", error.message);
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
};