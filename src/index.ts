export interface Interval {
  start: Date;
  end: Date;
}

export function tzScan(tz: string, interval: Interval) {
  const changes: any[] = [];
  const date = new Date(interval.start);
  date.setUTCSeconds(0, 0);
  const endDate = new Date(interval.end);
  endDate.setUTCSeconds(0, 0);
  const endTime = +endDate;

  let lastOffset = tzOffset(tz, date);
  while (+date < endTime) {
    date.setUTCHours(date.getUTCHours() + 1);

    const offset = tzOffset(tz, date);

    if (offset != lastOffset) {
      changes.push({
        date: new Date(date),
        change: offset - lastOffset,
        offset,
      });
    }

    lastOffset = offset;
  }

  return changes;
}

const formatCache: Record<string, Intl.DateTimeFormat["format"]> = {};

export function tzOffset(tz: string, date: Date) {
  const format = (formatCache[tz] ||= new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "numeric",
    timeZoneName: "longOffset",
  }).format);
  const [hours, minutes] = format(date).slice(6).split(":").map(Number);
  return hours! * 60 + minutes!;
}
