/**
 * The function returns the time zone name for the given date in the specified
 * time zone.
 *
 * It uses the `Intl.DateTimeFormat` API and outputs the time zone name in
 * a long format, e.g. "Pacific Standard Time" or "Singapore Standard Time".
 *
 * @param timeZone - Time zone name (IANA or UTC offset)
 * @param date - Date object to get the time zone name for
 * @returns Time zone name (e.g. "Singapore Standard Time")
 */
export function tzName(timeZone: string, date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    // Enforces engine to render the time. Without the option JavaScriptCore omits it.
    hour: "numeric",
    timeZone: timeZone,
    timeZoneName: "long",
  })
    .format(date)
    .split(/\s/g) // Format.JS uses non-breaking spaces
    .slice(2) // Skip the hour and AM/PM parts
    .join(" ");
}
