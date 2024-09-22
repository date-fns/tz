import { tzOffset } from "../tzOffset/index.ts";

export class TZDateMini extends Date {
  //#region static

  constructor(...args) {
    super();

    if (args.length > 1 && typeof args[args.length - 1] === "string") {
      this.timeZone = args.pop();
    }

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
        this.setTime(+new Date(...args));
        const offset = tzOffset(this.timeZone, this);
        const localOffset = -new Date(...args).getTimezoneOffset();
        fixDST(this, () =>
          Date.prototype.setMinutes.call(
            this,
            Date.prototype.getMinutes.call(this) + (localOffset - offset)
          )
        );
      }
    }

    this.internal = new Date();
    syncToInternal(this);
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
    return -tzOffset(this.timeZone, this);
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
      const args = arguments;
      Date.prototype[utcMethod].apply(this.internal, args);
      syncFromInternal(this);
      return +this;
    };

    // Assign UTC setter
    TZDateMini.prototype[utcMethod] = function () {
      const args = arguments;
      fixDST(this, () => Date.prototype[utcMethod].apply(this, args));
      syncToInternal(this);
      return +this;
    };
  }
});

function fixDST(date, update) {
  const offset = tzOffset(date.timeZone, date);
  update();
  const newOffset = tzOffset(date.timeZone, date);
  const diff = newOffset - offset;
  if (diff)
    Date.prototype.setUTCMinutes.call(date, date.getUTCMinutes() - diff);
}

function syncToInternal(date) {
  date.internal.setTime(+date);
  date.internal.setUTCMinutes(
    date.internal.getUTCMinutes() - date.getTimezoneOffset()
  );
}

function syncFromInternal(date) {
  date.setTime(+date.internal);
  Date.prototype.setUTCMinutes.call(
    date,
    Date.prototype.getUTCMinutes.call(date) + date.getTimezoneOffset()
  );
}
