export const getDefaultPicture = (title) => {
  return `https://ui-avatars.com/api/?size=128&length=1&name=${encodeURIComponent(
    title.charAt(0)
  )}&bold=true&background=random`;
}