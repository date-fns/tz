export interface Interval {
  start: Date;
  end: Date;
}

export function tzScan(tz: string, interval: Interval) {
  const changes: any[] = [];

  const monthDate = new Date(interval.start);
  monthDate.setUTCSeconds(0, 0);

  const endDate = new Date(interval.end);
  endDate.setUTCSeconds(0, 0);

  const lastMonthTime = +endDate;
  let lastOffset = tzOffset(tz, monthDate);
  while (+monthDate < lastMonthTime) {
    // Month forward
    monthDate.setUTCMonth(monthDate.getUTCMonth() + 1);

    // Find the month where the offset changes
    const offset = tzOffset(tz, monthDate);
    if (offset != lastOffset) {
      // Rewind a month back to find the day where the offset changes
      const dayDate = new Date(monthDate);
      dayDate.setUTCMonth(dayDate.getUTCMonth() - 1);

      const lastDayTime = +monthDate;
      lastOffset = tzOffset(tz, dayDate);
      while (+dayDate < lastDayTime) {
        // Day forward
        dayDate.setUTCDate(dayDate.getUTCDate() + 1);

        // Find the day where the offset changes
        const offset = tzOffset(tz, dayDate);
        if (offset != lastOffset) {
          // Rewind a day back to find the time where the offset changes
          const hourDate = new Date(dayDate);
          hourDate.setUTCDate(hourDate.getUTCDate() - 1);

          const endHourTime = +dayDate;
          lastOffset = tzOffset(tz, hourDate);
          while (+hourDate < endHourTime) {
            // Hour forward
            hourDate.setUTCHours(hourDate.getUTCHours() + 1);

            // Find the hour where the offset changes
            const hourOffset = tzOffset(tz, hourDate);
            if (hourOffset !== lastOffset) {
              changes.push({
                date: new Date(hourDate),
                change: hourOffset - lastOffset,
                offset: hourOffset,
              });
            }

            lastOffset = hourOffset;
          }
        }

        lastOffset = offset;
      }
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
