/**
 * Date formatting utilities for IRC26
 */

function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

export function formatDate(
  date: Date,
  format:
    | 'DD MMMM YYYY'
    | 'D MMMM YYYY'
    | 'DDth MMMM YYYY'
    | 'DD MMM YYYY'
    | 'DDth MMM YYYY'
    | 'HH[AM/PM] [TZ]'
    | 'hA [AEST]'
    | 'HH[AM/PM] DD MMM YYYY'
    | 'hA DD MMM YYYY'
    | 'hA DDth MMM YYYY'
    | 'DAYNAME'
): string {
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const monthShort = date.toLocaleDateString('en-US', { month: 'short' });
  const year = date.getFullYear();
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const ordinalSuffix = getOrdinalSuffix(day);

  // Get hours in 12-hour format
  const hours24 = date.getHours();
  const hours12 = hours24 === 0 ? 12 : hours24 > 12 ? hours24 - 12 : hours24;
  const ampm = hours24 >= 12 ? 'pm' : 'am';
  const ampmUpper = hours24 >= 12 ? 'PM' : 'AM';

  switch (format) {
    case 'DD MMMM YYYY':
      return `${day} ${month} ${year}`;
    case 'D MMMM YYYY':
      return `${day} ${month} ${year}`;
    case 'DDth MMMM YYYY':
      return `${day}${ordinalSuffix} ${month} ${year}`;
    case 'DD MMM YYYY':
      return `${day} ${monthShort.toUpperCase()} ${year}`;
    case 'DDth MMM YYYY':
      return `${day}${ordinalSuffix} ${monthShort} ${year}`;
    case 'HH[AM/PM] [TZ]':
      return `${hours12}${ampmUpper} AEST`;
    case 'hA [AEST]':
      return `${hours12}${ampmUpper} AEST`;
    case 'HH[AM/PM] DD MMM YYYY':
      return `${hours12}${ampmUpper} ${day} ${monthShort.toUpperCase()} ${year}`;
    case 'hA DD MMM YYYY':
      return `${hours12}${ampm} ${day} ${monthShort} ${year}`;
    case 'hA DDth MMM YYYY':
      return `${hours12}${ampm} ${day}${ordinalSuffix} ${monthShort} ${year}`;
    case 'DAYNAME':
      return dayName;
    default:
      return date.toLocaleDateString();
  }
}

