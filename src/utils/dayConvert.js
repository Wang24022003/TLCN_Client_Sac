export function formatDate(isoString) {
  const date = new Date(isoString);

  const day = date.getDate().toString().padStart(2, '0'); // Lấy ngày và thêm '0' nếu cần
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Lấy tháng (cộng 1) và thêm '0'
  const year = date.getFullYear(); // Lấy năm

  return `${day}/${month}/${year}`; // Trả về định dạng dd/mm/yyyy
}

export function formatMessageTime(datetimeString) {
  const messageDate = new Date(datetimeString);
  const today = new Date();

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  if (isSameDay(messageDate, today)) {
    // Show only the time (HH:MM)
    return messageDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  } else {
    // Show detailed date and time (e.g., May 1, 10:52 AM)
    return (
      messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' }) +
      ', ' +
      messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  }
}
