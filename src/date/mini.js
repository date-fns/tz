import { tzOffset } from "../tzOffset/index.ts";

export class TZDateMini extends Date {
  //#region static

  constructor(...args) {
    super();

    if (args.length > 1 && typeof args[args.length - 1] === "string") {
      this.timeZone = args.pop();
    }

    this.internal = new Date();

    if (isNaN(tzOffset(this.timeZone, this))) {
      this.setTime(NaN);
    } else {
      if (!args.length) {
        this.setTime(Date.now());
      } else if (
        typeof args[0] === "number" &&
        (args.length === 1 ||
          (args.length === 2 && typeof args[1] !== "number"))
      ) {
        this.setTime(args[0]);
      } else if (typeof args[0] === "string") {
        this.setTime(+new Date(args[0]));
      } else if (args[0] instanceof Date) {
        this.setTime(+args[0]);
      } else {
        // Resolve the wall-clock values directly in the date time zone, so
        // the result doesn't depend on the system time zone DST transitions.
        this.setTime(wallToTime(this.timeZone, Date.UTC(...args)));
      }
    }
  }

  static tz(tz, ...args) {
    return args.length
      ? new TZDateMini(...args, tz)
      : new TZDateMini(Date.now(), tz);
  }

  //#endregion

  //#region time zone

  withTimeZone(timeZone) {
    return new TZDateMini(+this, timeZone);
  }

  getTimezoneOffset() {
    const offset = -tzOffset(this.timeZone, this);
    // Remove the seconds offset
    // use Math.floor for negative GMT timezones and Math.ceil for positive GMT timezones.
    return offset > 0 ? Math.floor(offset) : Math.ceil(offset);
  }

  //#endregion

  //#region time

  setTime(time) {
    Date.prototype.setTime.apply(this, arguments);
    syncToInternal(this);
    return +this;
  }

  //#endregion

  //#region date-fns integration

  [Symbol.for("constructDateFrom")](date) {
    return new TZDateMini(+new Date(date), this.timeZone);
  }

  //#endregion
}

// Assign getters and setters
const re = /^(get|set)(?!UTC)/;
Object.getOwnPropertyNames(Date.prototype).forEach((method) => {
  if (!re.test(method)) return;

  const utcMethod = method.replace(re, "$1UTC");
  // Filter out methods without UTC counterparts
  if (!TZDateMini.prototype[utcMethod]) return;

  if (method.startsWith("get")) {
    // Delegate to internal date's UTC method
    TZDateMini.prototype[method] = function () {
      return this.internal[utcMethod]();
    };
  } else {
    // Assign regular setter
    TZDateMini.prototype[method] = function () {
      Date.prototype[utcMethod].apply(this.internal, arguments);
      syncFromInternal(this);
      return +this;
    };

    // Assign UTC setter
    TZDateMini.prototype[utcMethod] = function () {
      Date.prototype[utcMethod].apply(this, arguments);
      syncToInternal(this);
      return +this;
    };
  }
});

/**
 * Function converts wall-clock time in the given time zone to a timestamp.
 * It mirrors the native `Date` behavior: ambiguous time (DST end) resolves to
 * the earlier moment, and nonexistent time (DST start) is moved forward.
 *
 * @param {string} timeZone - Time zone name
 * @param {number} wall - Wall-clock time represented as UTC timestamp
 *
 * @returns {number} The timestamp
 */
function wallToTime(timeZone, wall) {
  if (isNaN(wall)) return NaN;

  const toTime = (offset) => wall - Math.round(offset * 60) * 1000;
  const isValid = (offset) =>
    tzOffset(timeZone, new Date(toTime(offset))) === offset;

  // Offsets before and after the wall time cover any transition around it.
  const before = tzOffset(timeZone, new Date(wall - 864e5));
  const after = tzOffset(timeZone, new Date(wall + 864e5));

  // Ambiguous or regular time, pick the earlier moment
  const candidates = [before, after].filter(isValid);
  if (candidates.length) return Math.min(...candidates.map(toTime));

  // The wall time falls into a gap, so apply the offset before the transition
  return toTime(before);
}

/**
 * Function syncs time to internal date, applying the time zone offset.
 *
 * @param {Date} date - Date to sync
 */
function syncToInternal(date) {
  date.internal.setTime(+date);
  date.internal.setUTCSeconds(
    date.internal.getUTCSeconds() -
      Math.round(-tzOffset(date.timeZone, date) * 60),
  );
}

/**
 * Function syncs the internal date UTC values to the date. It allows to get
 * accurate timestamp value.
 *
 * @param {Date} date - The date to sync
 */
function syncFromInternal(date) {
  // The internal date UTC values represent the wall-clock time in the date
  // time zone, so we resolve them to the timestamp and sync back to normalize
  // the internal values (i.e. when the time falls into the DST gap).
  Date.prototype.setTime.call(date, wallToTime(date.timeZone, +date.internal));
  syncToInternal(date);
}
