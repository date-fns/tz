const offsetFormatCache: Record<string, Intl.DateTimeFormat["format"]> = {};

const offsetCache: Record<string, number> = {};

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
    const format = (offsetFormatCache[timeZone!] ||= new Intl.DateTimeFormat(
      "en-GB",
      { timeZone, hour: "numeric", timeZoneName: "longOffset" }
    ).format);

    const offsetStr = format(date).slice(6);
    if (offsetStr in offsetCache) return offsetCache[offsetStr]!;

    const [hours, minutes] = offsetStr.split(":").map(Number);
    return (offsetCache[offsetStr] = hours! * 60 + (minutes || 0));
  } catch {
    return NaN;
  }
}
