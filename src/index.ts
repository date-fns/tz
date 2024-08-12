export class TZDate extends Date {
  timeZone: string | undefined;

  /**
   * Representation of the date values in the timezone. It is skewed by
   * the timezone offset.
   */
  // @ts-expect-error: this.sync() sets the value but TypeScript doesn't know
  // about it.
  private internal: Date;

  constructor(timeZone?: string, time?: number) {
    super();
    this.setTime(time ?? Date.now());
    this.timeZone = timeZone;
    this.sync();
  }

  getDate() {
    return this.internal.getUTCDate();
  }

  getFullYear(): number {
    return this.internal.getUTCFullYear();
  }

  getHours(): number {
    return this.internal.getUTCHours();
  }

  getMonth(): number {
    return this.internal.getUTCMonth();
  }

  getTimezoneOffset(): number {
    return tzOffset(this.timeZone, this);
  }

  setMilliseconds(ms: number): number {
    this.setUTCMilliseconds(ms);
    this.sync();
    return this.internal.getUTCMilliseconds();
  }

  withTimeZone(timeZone: string) {
    return new TZDate(timeZone, +this);
  }

  private sync() {
    this.internal = new Date(+this);
    const offset = tzOffset(this.timeZone, this);
    this.internal.setUTCMinutes(this.internal.getUTCMinutes() + offset);
  }
}

export interface Interval {
  start: Date;
  end: Date;
}

export interface Change {
  date: Date;
  change: number;
  offset: number;
}

export function tzScan(tz: string, interval: Interval): Change[] {
  const changes: Change[] = [];

  const monthDate = new Date(interval.start);
  monthDate.setUTCSeconds(0, 0);

  const endDate = new Date(interval.end);
  endDate.setUTCSeconds(0, 0);

  const endMonthTime = +endDate;
  let lastOffset = tzOffset(tz, monthDate);
  while (+monthDate < endMonthTime) {
    // Month forward
    monthDate.setUTCMonth(monthDate.getUTCMonth() + 1);

    // Find the month where the offset changes
    const offset = tzOffset(tz, monthDate);
    if (offset != lastOffset) {
      // Rewind a month back to find the day where the offset changes
      const dayDate = new Date(monthDate);
      dayDate.setUTCMonth(dayDate.getUTCMonth() - 1);

      const endDayTime = +monthDate;
      lastOffset = tzOffset(tz, dayDate);
      while (+dayDate < endDayTime) {
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

const offsetCache: Record<string, number> = {};

export function tzOffset(tz: string | undefined, date: Date): number {
  const format = (formatCache[tz!] ||= new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "numeric",
    timeZoneName: "longOffset",
  }).format);

  const offsetStr = format(date).slice(6);
  if (offsetStr in offsetCache) return offsetCache[offsetStr]!;

  const [hours, minutes] = offsetStr.split(":").map(Number);
  return (offsetCache[offsetStr] = hours! * 60 + minutes!);
}
