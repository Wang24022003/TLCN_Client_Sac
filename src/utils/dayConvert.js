export function formatDate(isoString) {
  const date = new Date(isoString);

  const day = date.getDate().toString().padStart(2, "0"); // Lấy ngày và thêm '0' nếu cần
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Lấy tháng (cộng 1) và thêm '0'
  const year = date.getFullYear(); // Lấy năm

  return `${day}/${month}/${year}`; // Trả về định dạng dd/mm/yyyy
}
