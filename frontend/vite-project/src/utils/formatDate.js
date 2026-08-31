/* ============================================================
   FORMAT DATE
============================================================ */
  
export default function formatDate(date) {
  if (!date) {
    return "";
  }

  const now = new Date();
  const created = new Date(date);

  const difference = now.getTime() - created.getTime();

  const seconds = Math.floor(difference / 1000);

  const minutes = Math.floor(seconds / 60);

  const hours = Math.floor(minutes / 60);

  const days = Math.floor(hours / 24);

  const months = Math.floor(days / 30);

  const years = Math.floor(days / 365);

  if (years > 0) {
    return `${years} ${years === 1 ? "year" : "years"} ago`;
  }

  if (months > 0) {
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  }

  if (days > 0) {
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }

  if (hours > 0) {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  }

  return "Just now";
}
