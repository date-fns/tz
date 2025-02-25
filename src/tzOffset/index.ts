const offsetFormatCache: Record<string, Intl.DateTimeFormat["format"]> = {};

const offsetCache: Record<string, number> = {};

/**
 * Method to feature-detect "longOffset" support in Intl.DateTimeFormat options.
 * This is used to determine whether to use the `longOffset` or `long` timeZoneName option.
 * 
 * For more details please see https://github.com/date-fns/tz/issues/23#issuecomment-2664954251
 * @returns true if the runtime supports `longOffset`, false otherwise
 */
function supportsLongOffset() {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', timeZoneName: 'longOffset' });
    return true;
  } catch {
    return false;
  }
}

/**
 * The function extracts UTC offset as a string in the format "+HH:MM" or "-HH:MM" from the given date in specified
 * time zone.
 *
 * @param timeZone - Time zone name (IANA or UTC offset)
 * @param date - Date to check the offset for
 *
 * @returns UTC offset as a string in the format "+HH:MM" or "-HH:MM"
 */
function getGmtOffsetString(timeZone: string | undefined, date: Date) {
  // NOTE: use Intl.DateTimeFormat with the timezone
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    timeZoneName: 'short' // Use "short" since "longOffset" is unsupported in iOS 15.4 and below
  });

  // NOTE: get the formatted parts
  const parts = dtf.formatToParts(date);

  // NOTE: find the timezone name (e.g., EST or GMT+02:00)
  const timeZoneAbbreviation = parts.find(part => part.type === 'timeZoneName')?.value;

  // NOTE: If timezone abbreviation is found, we can extract the offset
  if (timeZoneAbbreviation) {
    // NOTE: create a formatter for UTC time and get the difference
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const targetDate = new Date(date.toLocaleString('en-US', { timeZone }));

    // NOTE: calculate the offset in minutes
    const offsetMinutes = (targetDate.getTime() - utcDate.getTime()) / (60 * 1000);
    const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
    const offsetRemainder = Math.abs(offsetMinutes) % 60;
    const sign = offsetMinutes >= 0 ? '+' : '-';

    // NOTE: format offset as "-05:00"
    const gmtOffsetString = `${sign}${offsetHours.toString().padStart(2, '0')}:${offsetRemainder.toString().padStart(2, '0')}`;

    return gmtOffsetString;
  }

  // NOTE: fallback to +00:00 if timezone abbreviation is not found
  return '+00:00';

}

// NOTE: set the flag if "longOffset" is supported in Intl.DateTimeFormat options.
const isLongOffsetSupported = supportsLongOffset();

/**
 * The function extracts UTC offset in minutes from the given date in specified
 * time zone.
 *
 * Unlike `Date.prototype.getTimezoneOffset`, this function returns the value
 * mirrored to the sign of the offset in the time zone. For Asia/Singapore
 * (UTC+8), `tzOffset` returns 480, while `getTimezoneOffset` returns -480.
 *
 * @param timeZone - Time zone name (IANA or UTC offset)
 * @param date - Date to check the offset for
 *
 * @returns UTC offset in minutes
 */
export function tzOffset(timeZone: string | undefined, date: Date): number {
  try {
    let offsetStr;
    if (isLongOffsetSupported) {
      const format = (offsetFormatCache[timeZone!] ||= new Intl.DateTimeFormat(
        "en-GB",
        { timeZone, hour: "numeric", timeZoneName: "longOffset" }
      ).format);

      offsetStr = format(date).split('GMT')[1] || '';
    } else {
      // NOTE: fallback to the old method to get offsetStr, if "longOffset" is not supported in Intl.DateTimeFormat options (iOS 15.4 and below).
      // for more details, see https://github.com/date-fns/tz/issues/23#issuecomment-2664954251
      offsetStr = getGmtOffsetString(timeZone, date);
    }
    if (offsetStr in offsetCache) return offsetCache[offsetStr]!;

    return calcOffset(offsetStr, offsetStr.split(":"));
  } catch {
    // Fallback to manual parsing if the runtime doesn't support ±HH:MM/±HHMM/±HH
    // See: https://github.com/nodejs/node/issues/53419
    if (timeZone! in offsetCache) return offsetCache[timeZone!]!;
    const captures = timeZone?.match(offsetRe);
    if (captures) return calcOffset(timeZone!, captures.slice(1));

    return NaN;
  }
}

const offsetRe = /([+-]\d\d):?(\d\d)?/;

function calcOffset(cacheStr: string, values: string[]): number {
  const hours = +values[0]!;
  const minutes = +(values[1] || 0);
  return (offsetCache[cacheStr] =
    hours > 0 ? hours * 60 + minutes : hours * 60 - minutes);
}
