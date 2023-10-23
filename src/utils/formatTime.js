const formatTime = (dateTime) => {
  const date = new Date(dateTime);
  return date.toLocaleTimeString("en-US", {
    hour12: true,
    hour: "numeric",
    minute: "2-digit",
  });
};

export default formatTime;
