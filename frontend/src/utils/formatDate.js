/**
 * @param {string} dateTime
 * ISO 8601 date-time string.
 * @returns {string} D MMM, YYYY.
 */
export function formatDate(dateTime) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).formatToParts(new Date(dateTime));

  const day = parts.find((part) => part.type === "day")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const year = parts.find((part) => part.type === "year")?.value;

  return `${day} ${month}, ${year}`;
}
