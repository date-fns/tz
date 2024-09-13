import { constructFromSymbol } from "../constants/index.ts";

/**
 * Time zone date class. It overrides original Date functions making them
 * to perform all the calculations in the given time zone.
 *
 * It also provides new functions useful when working with time zones.
 *
 * Combined with date-fns, it allows using the class the same way as
 * the original date class.
 *
 * This complete version provides formatter functions, mirroring all original
 * methods of the `Date` class. It's build-size-heavier than `TZDateMini` and
 * should be used when you need to format a string or in an environment you
 * don't fully control (a library).
 *
 * For the minimal version, see `TZDateMini`.
 */
export class TZDate extends Date {
  constructor();

  constructor(dateStr: string, timeZone?: string);

  constructor(date: Date, timeZone?: string);

  constructor(timestamp: number, timeZone?: string);

  constructor(year: number, month: number, timeZone?: string);

  constructor(year: number, month: number, date: number, timeZone?: string);

  constructor(
    year: number,
    month: number,
    date: number,
    hours: number,
    timeZone?: string
  );

  constructor(
    year: number,
    month: number,
    date: number,
    hours: number,
    minutes: number,
    timeZone?: string
  );

  constructor(
    year: number,
    month: number,
    date: number,
    hours: number,
    minutes: number,
    seconds: number,
    timeZone?: string
  );

  constructor(
    year: number,
    month: number,
    date: number,
    hours: number,
    minutes: number,
    seconds: number,
    milliseconds: number,
    timeZone?: string
  );

  static tz(tz: string): TZDate;

  static tz(tz: string, timestamp: number): TZDate;

  static tz(tz: string, dateStr: string): TZDate;

  static tz(tz: string, date: Date): TZDate;

  static tz(tz: string, year: number, month: number): TZDate;

  static tz(tz: string, year: number, month: number, date: number): TZDate;

  static tz(
    tz: string,
    year: number,
    month: number,
    date: number,
    hours: number
  ): TZDate;

  static tz(
    tz: string,
    year: number,
    month: number,
    date: number,
    hours: number,
    minutes: number
  ): TZDate;

  static tz(
    tz: string,
    year: number,
    month: number,
    date: number,
    hours: number,
    minutes: number,
    seconds: number
  ): TZDate;

  static tz(
    tz: string,
    year: number,
    month: number,
    date: number,
    hours: number,
    minutes: number,
    seconds: number,
    milliseconds: number
  ): TZDate;

  /**
   * The current time zone of the date.
   */
  readonly timeZone: string | undefined;

  withTimeZone(timeZone: string): TZDate;

  [constructFromSymbol](date: Date | number | string): TZDate;
}
