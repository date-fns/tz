export class TZDate extends Date {
  timeZone: string | undefined;

  /**
   * Representation of the date values in the timezone. It is skewed by
   * the timezone offset.
   */

  private internal: Date;

  constructor(timeZone?: string, time?: number) {
    super();
    this.setTime(time ?? Date.now());
    this.timeZone = timeZone;
    this.internal = new Date();
    this.syncToInternal();
  }

  //#region year

  getFullYear(): number {
    return this.internal.getUTCFullYear();
  }

  setFullYear(year: number, month?: number, date?: number): number {
    const args = arguments;
    // @ts-expect-error: arguments aren't properly typed in TypeScript:
    // https://github.com/microsoft/TypeScript/issues/57164
    Date.prototype.setUTCFullYear.apply(this.internal, args);
    this.syncFromInternal();
    return +this;
  }

  setUTCFullYear(year: number, month?: number, date?: number): number {
    const args = arguments;
    // @ts-expect-error: arguments aren't properly typed in TypeScript:
    // https://github.com/microsoft/TypeScript/issues/57164
    this.fixDST(() => Date.prototype.setUTCFullYear.apply(this, args));
    this.syncToInternal();
    return +this;
  }

  //#endregion

  //#region month

  getMonth(): number {
    return this.internal.getUTCMonth();
  }

  setMonth(month: number, date?: number): number {
    // @ts-expect-error: arguments aren't properly typed in TypeScript:
    // https://github.com/microsoft/TypeScript/issues/57164
    Date.prototype.setUTCMonth.apply(this.internal, arguments);
    this.syncFromInternal();
    return +this;
  }

  setUTCMonth(month: number, date?: number): number {
    const args = arguments;
    // @ts-expect-error: arguments aren't properly typed in TypeScript:
    // https://github.com/microsoft/TypeScript/issues/57164
    this.fixDST(() => Date.prototype.setUTCMonth.apply(this, args));
    this.syncToInternal();
    return +this;
  }

  //#endregion

  //#region date

  getDate() {
    return this.internal.getUTCDate();
  }

  setDate(date: number): number {
    Date.prototype.setUTCDate.call(this.internal, date);
    this.syncFromInternal();
    return +this;
  }

  setUTCDate(date: number): number {
    this.fixDST(() => Date.prototype.setUTCDate.call(this, date));
    this.syncToInternal();
    return +this;
  }

  //#endregion

  //#region hours

  getHours(): number {
    return this.internal.getUTCHours();
  }

  setHours(hours: number, min?: number, sec?: number, ms?: number): number {
    const args = arguments;
    // @ts-expect-error: arguments aren't properly typed in TypeScript:
    // https://github.com/microsoft/TypeScript/issues/57164
    Date.prototype.setUTCHours.apply(this.internal, args);
    this.syncFromInternal();
    return +this;
  }

  setUTCHours(hours: number, min?: number, sec?: number, ms?: number): number {
    const args = arguments;
    // @ts-expect-error: arguments aren't properly typed in TypeScript:
    // https://github.com/microsoft/TypeScript/issues/57164
    Date.prototype.setUTCHours.apply(this, args);
    this.syncToInternal();
    return +this;
  }

  //#endregion

  //#region minutes

  getMinutes(): number {
    return this.internal.getUTCMinutes();
  }

  setMinutes(min: number, sec?: number, ms?: number): number {
    const args = arguments;
    // @ts-expect-error: arguments aren't properly typed in TypeScript:
    // https://github.com/microsoft/TypeScript/issues/57164
    Date.prototype.setUTCMinutes.apply(this.internal, args);
    this.syncFromInternal();
    return +this;
  }

  setUTCMinutes(min: number, sec?: number, ms?: number): number {
    const args = arguments;
    // @ts-expect-error: arguments aren't properly typed in TypeScript:
    // https://github.com/microsoft/TypeScript/issues/57164
    Date.prototype.setUTCMinutes.apply(this, args);
    this.syncToInternal();
    return +this;
  }

  //#endregion

  //#region seconds

  setSeconds(sec: number, ms?: number): number {
    const args = arguments;
    // @ts-expect-error: arguments aren't properly typed in TypeScript:
    // https://github.com/microsoft/TypeScript/issues/57164
    Date.prototype.setUTCSeconds.apply(this.internal, args);
    this.syncFromInternal();
    return +this;
  }

  setUTCSeconds(sec: number, ms?: number): number {
    const args = arguments;
    // @ts-expect-error: arguments aren't properly typed in TypeScript:
    // https://github.com/microsoft/TypeScript/issues/57164
    Date.prototype.setUTCSeconds.apply(this, args);
    this.syncToInternal();
    return +this;
  }

  //#endregion

  //#region milliseconds

  setMilliseconds(ms: number): number {
    Date.prototype.setUTCMilliseconds.call(this, ms);
    this.syncToInternal();
    return +this;
  }

  setUTCMilliseconds(ms: number): number {
    Date.prototype.setUTCMilliseconds.call(this, ms);
    this.syncToInternal();
    return +this;
  }

  //#endregion

  //#region time zone

  withTimeZone(timeZone: string) {
    return new TZDate(timeZone, +this);
  }

  getTimezoneOffset(): number {
    return -tzOffset(this.timeZone, this);
  }

  //#endregion

  //#region representation

  toISOString(): string {
    const [sign, hours, minutes] = this.tzComponents();
    const tz = `${sign}${hours}:${minutes}`;
    return this.internal.toISOString().slice(0, -1) + tz;
  }

  toString(): string {
    // "Tue Aug 13 2024 07:50:19 GMT+0800 (Singapore Standard Time)";
    return `${this.toDateString()} ${this.toTimeString()}`;
  }

  toDateString(): string {
    // toUTCString returns RFC 7231 ("Mon, 12 Aug 2024 23:36:08 GMT")
    const [day, date, month, year] = this.internal.toUTCString().split(" ");
    // "Tue Aug 13 2024"
    return `${day?.slice(0, -1) /* Remove "," */} ${month} ${date} ${year}`;
  }

  toTimeString(): string {
    // toUTCString returns RFC 7231 ("Mon, 12 Aug 2024 23:36:08 GMT")
    const time = this.internal.toUTCString().split(" ")[4];
    const [sign, hours, minutes] = this.tzComponents();
    // "07:42:23 GMT+0800 (Singapore Standard Time)"
    return `${time} GMT${sign}${hours}${minutes} (${tzName(
      this.timeZone,
      this
    )})`;
  }

  toLocaleString(
    locales?: Intl.LocalesArgument,
    options?: Intl.DateTimeFormatOptions
  ): string {
    return Date.prototype.toLocaleString.call(this, locales, {
      ...options,
      timeZone: options?.timeZone || this.timeZone,
    });
  }

  toLocaleDateString(
    locales?: Intl.LocalesArgument,
    options?: Omit<Intl.DateTimeFormatOptions, "timeStyle">
  ): string {
    return Date.prototype.toLocaleDateString.call(this, locales, {
      ...options,
      timeZone: options?.timeZone || this.timeZone,
    });
  }

  toLocaleTimeString(
    locales?: Intl.LocalesArgument,
    options?: Omit<Intl.DateTimeFormatOptions, "dateStyle">
  ): string {
    return Date.prototype.toLocaleTimeString.call(this, locales, {
      ...options,
      timeZone: options?.timeZone || this.timeZone,
    });
  }

  //#endregion

  //#region private

  private tzComponents(): [string, string, string] {
    const offset = this.getTimezoneOffset();
    const sign = offset > 0 ? "-" : "+";
    const hours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, "0");
    const minutes = String(Math.abs(offset) % 60).padStart(2, "0");
    return [sign, hours, minutes];
  }

  private syncToInternal() {
    this.internal.setTime(+this);
    this.internal.setUTCMinutes(
      this.internal.getUTCMinutes() - this.getTimezoneOffset()
    );
  }

  private syncFromInternal() {
    this.setTime(+this.internal);
    this.setUTCMinutes(this.getUTCMinutes() + this.getTimezoneOffset());
  }

  private fixDST(update: Function) {
    const offset = tzOffset(this.timeZone, this);
    update();
    const newOffset = tzOffset(this.timeZone, this);
    const diff = newOffset - offset;
    if (diff)
      Date.prototype.setUTCMinutes.call(this, this.getUTCMinutes() - diff);
  }

  //#endregion
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
  return (offsetCache[offsetStr] = hours! * 60 + minutes!);
}

function tzName(tz: string | undefined, date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    timeZoneName: "long",
  })
    .format(date)
    .slice(12);
}
