/**
 * IRC26 Configuration
 * Centralized configuration for event dates and constants
 */

export const EVENT_TIMEZONE = 'Australia/Sydney';

/**
 * Single source of truth: the official "It's Raining Caches" publish time.
 * New date/time: 14 February 2026, 9:00 AM (Sydney time).
 *
 * Use an ISO string with the correct UTC offset for Sydney in February (AEDT = UTC+11).
 * If you later change this, SUBMISSION_DEADLINE will update automatically.
 */
export const RAIN_START_ISO = '2026-02-14T09:00:00+11:00';

/** Helpers (no extra libraries) */
const toDate = (iso: string) => new Date(iso);

const minusDays = (iso: string, days: number) => {
  const d = new Date(iso);
  d.setDate(d.getDate() - days);
  // Preserve the timezone offset from the original ISO string
  const offset = iso.slice(-6); // Extract '+11:00' or similar
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offset}`;
};

/** Derived constants (do NOT hardcode) */
export const RAIN_START_DATE = toDate(RAIN_START_ISO);
/** Exactly two weeks before the event, same local time */
export const SUBMISSION_DEADLINE_ISO = minusDays(RAIN_START_ISO, 14);
export const SUBMISSION_DEADLINE = toDate(SUBMISSION_DEADLINE_ISO);

// Cache types (matching Prisma enum)
export const CACHE_TYPES = [
  'TRADITIONAL',
  'MULTI',
  'MYSTERY',
  'LETTERBOX',
  'WHERIGO',
  'VIRTUAL',
] as const;

// Cache sizes (matching Prisma enum)
export const CACHE_SIZES = [
  'NANO',
  'MICRO',
  'SMALL',
  'REGULAR',
  'LARGE',
  'OTHER',
] as const;

// Australian states and territories (matching Prisma enum)
export const AU_STATES = [
  'ACT',
  'NSW',
  'NT',
  'QLD',
  'SA',
  'TAS',
  'VIC',
  'WA',
] as const;

// Difficulty and terrain ratings (1.0 to 5.0 in 0.5 steps)
export const DIFFICULTY_RATINGS = [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0] as const;
export const TERRAIN_RATINGS = [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0] as const;





