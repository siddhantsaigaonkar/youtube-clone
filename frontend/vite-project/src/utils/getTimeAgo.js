function getTimeAgo(date) {
  const now = new Date();
  const createdDate = new Date(date);

  const differenceInSeconds = Math.floor((now - createdDate) / 1000);

  // Seconds
  if (differenceInSeconds < 60) {
    return `${differenceInSeconds} seconds ago`;
  }

  // Minutes
  const minutes = Math.floor(differenceInSeconds / 60);

  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  }

  // Hours
  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  // Days
  const days = Math.floor(hours / 24);

  if (days < 30) {
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }

  // Months
  const months = Math.floor(days / 30);

  if (months < 12) {
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  }

  // Years
  const years = Math.floor(months / 12);

  return `${years} ${years === 1 ? "year" : "years"} ago`;
}

export default getTimeAgo;
