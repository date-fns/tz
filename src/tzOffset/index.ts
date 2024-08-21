const offsetFormatCache: Record<string, Intl.DateTimeFormat["format"]> = {};

const offsetCache: Record<string, number> = {};

export function tzOffset(tz: string | undefined, date: Date): number {
  const format = (offsetFormatCache[tz!] ||= new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "numeric",
    timeZoneName: "longOffset",
  }).format);

  const offsetStr = format(date).slice(6);
  if (offsetStr in offsetCache) return offsetCache[offsetStr]!;

  const [hours, minutes] = offsetStr.split(":").map(Number);
  return (offsetCache[offsetStr] = hours! * 60 + (minutes || 0));
}
