import { getFileUrl, uploadFile } from "../config/firebaseConfig.js";
import fs from "fs/promises";
import path from "path";

export const uploadImageToStorage = async (destination, file) => {
  // Validar que el archivo existe
  if (!file || !file.path) {
    throw new Error("Archivo no válido");
  }

  // Validar que sea una imagen por mimetype
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'image/bmp',
    'image/tiff'
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new Error("El archivo debe ser una imagen válida (JPEG, PNG, GIF, WebP, BMP, TIFF)");
  }

  // Validar por extensión como respaldo
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff'];
  const fileExtension = path.extname(file.originalname || file.filename || '').toLowerCase();
  
  if (!allowedExtensions.includes(fileExtension)) {
    throw new Error("Extensión de archivo no válida para imagen");
  }

  // Validar tamaño del archivo (20MB = 20 * 1024 * 1024 bytes)
  const maxSizeInBytes = 20 * 1024 * 1024; // 20MB
  
  if (file.size > maxSizeInBytes) {
    throw new Error("La imagen no puede pesar más de 20MB");
  }

  // Validar que el archivo existe físicamente
  try {
    await fs.access(file.path);
  } catch (error) {
    console.error("El archivo no existe en el sistema:", error);
    throw new Error("El archivo no existe en el sistema");
  }

  await uploadFile(file.path, destination);

  const fileUrl = await getFileUrl(destination);

  // Eliminar el archivo local después de subirlo exitosamente
  try {
    await fs.unlink(file.path);
    console.log(`Archivo local eliminado: ${file.path}`);
  } catch (error) {
    console.warn(`No se pudo eliminar el archivo local: ${error.message}`);
  }

  return fileUrl;
};
