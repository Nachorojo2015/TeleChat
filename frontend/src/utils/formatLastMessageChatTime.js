export const formatLastMessageChatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();

  const isSameDay = date.toDateString() === now.toDateString();

  // Día de la semana (0 = domingo, 6 = sábado)
  const daysOfWeek = ["dom", "lun", "mar", "mie", "jue", "vie", "sab"];
  // Meses abreviados
  const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

  // Función para calcular si está en la misma semana
  const startOfWeek = (d) => {
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Lunes como primer día
    return new Date(d.setDate(diff));
  };

  const isSameWeek = startOfWeek(new Date(now)) <= date && date <= new Date();

  if (isSameDay) {
    // Caso 1: mismo día → HH:MM
    return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  } else if (isSameWeek) {
    // Caso 2: misma semana → día de la semana abreviado
    return daysOfWeek[date.getDay()];
  } else {
    // Caso 3: otra semana → día + mes abreviado
    return `${date.getDate()} ${months[date.getMonth()]}`;
  }
};
