export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (error) {
    console.error("Invalid URL:", error);
    return false;
  }
}