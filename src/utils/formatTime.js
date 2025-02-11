const formatTime = () => {
  const now = new Date();
  const day = now.getDate();
  const month = now.toLocaleString("default", { month: "short" });
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const year = now.getFullYear();
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

  return `${day} ${month} ${year} ${formattedHours}:${formattedMinutes} ${ampm}`;
};

export default formatTime;
