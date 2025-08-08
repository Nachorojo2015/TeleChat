export const formatLastSessionTime = (timestamp) => {
  if (!timestamp) return "ult. vez hace mucho tiempo";

  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now - date; // diferencia en milisegundos
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHrs = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHrs / 24);

  // Casos especiales
  if (diffSec < 60) {
    return "ult. vez recientemente";
  }

  if (diffMin < 60) {
    return `ult. vez hace ${diffMin} minuto${diffMin > 1 ? "s" : ""}`;
  }

  if (diffHrs < 24 && date.getDate() === now.getDate()) {
    // Mismo día → mostrar hora
    return `ult. vez hoy a las ${date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  if (diffHrs < 24) {
    return `ult. vez hace ${diffHrs} hora${diffHrs > 1 ? "s" : ""}`;
  }

  if (diffDays < 30) {
    return `ult. vez hace ${diffDays} día${diffDays > 1 ? "s" : ""}`;
  }

  return "ult. vez hace mucho tiempo";
};
