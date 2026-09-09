import { OpeningHours, Weekday } from '../models/menu.model';

const weekdays: readonly Weekday[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

interface RestaurantLocalTime {
  readonly day: Weekday;
  readonly minutes: number;
}

/**
 * Evaluates configured hours in the restaurant's local time, rather than the
 * visitor's device time zone. Supports hours that continue past midnight.
 */
export function isRestaurantOpen(
  openingHours: readonly OpeningHours[],
  now = new Date(),
  timeZone = 'Asia/Tbilisi',
): boolean {
  const localTime = getRestaurantLocalTime(now, timeZone);
  const todayHours = openingHours.find((hours) => hours.day === localTime.day);

  if (todayHours && isOpenDuringHours(todayHours, localTime.minutes)) {
    return true;
  }

  const previousDay = weekdays[(weekdays.indexOf(localTime.day) + weekdays.length - 1) % weekdays.length];
  const previousHours = openingHours.find((hours) => hours.day === previousDay);

  return previousHours ? isOpenFromPreviousDay(previousHours, localTime.minutes) : false;
}

function getRestaurantLocalTime(now: Date, timeZone: string): RestaurantLocalTime {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const value = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((part) => part.type === type)?.value ?? '';

  return {
    day: value('weekday').toLocaleLowerCase('en-US') as Weekday,
    minutes: Number(value('hour')) * 60 + Number(value('minute')),
  };
}

function isOpenDuringHours(hours: OpeningHours, currentMinutes: number): boolean {
  const opensAt = minutesFromTime(hours.opensAt);
  const closesAt = minutesFromTime(hours.closesAt);

  if (opensAt === null || closesAt === null) {
    return false;
  }

  if (opensAt === closesAt) {
    return true;
  }

  if (closesAt > opensAt) {
    return currentMinutes >= opensAt && currentMinutes < closesAt;
  }

  return currentMinutes >= opensAt;
}

function isOpenFromPreviousDay(hours: OpeningHours, currentMinutes: number): boolean {
  const opensAt = minutesFromTime(hours.opensAt);
  const closesAt = minutesFromTime(hours.closesAt);

  return opensAt !== null && closesAt !== null && closesAt < opensAt && currentMinutes < closesAt;
}

function minutesFromTime(value: string): number | null {
  const match = /^(?:[01]\d|2[0-3]):[0-5]\d$/.exec(value.trim());

  if (!match) {
    return null;
  }

  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
}
