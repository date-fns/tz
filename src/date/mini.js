import { constructFromSymbol } from "../constants/index.ts";
import { tzOffset } from "../index.ts";

export class TZDateMini extends Date {
  //#region static

  constructor(...args) {
    super();

    if (args.length > 1 && typeof args[args.length - 1] === "string") {
      this.timeZone = args.pop();
    }

    if (!args.length) {
      this.setTime(Date.now());
    } else if (
      typeof args[0] === "number" &&
      (args.length === 1 || (args.length === 2 && typeof args[1] !== "number"))
    ) {
      this.setTime(args[0]);
    } else if (typeof args[0] === "string") {
      this.setTime(+new Date(args[0]));
    } else {
      this.setTime(+new Date(...args));
      const offset = tzOffset(this.timeZone, this);
      const localOffset = -new Date(...args).getTimezoneOffset();
      Date.prototype.setMinutes.call(
        this,
        Date.prototype.getMinutes.call(this) + (localOffset - offset)
      );
    }

    this.internal = new Date();
    this.syncToInternal();
  }

  static TZ(tz, ...args) {
    return args.length
      ? new TZDateMini(...args, tz)
      : new TZDateMini(Date.now(), tz);
  }

  //#endregion

  //#region year

  getFullYear() {
    return this.internal.getUTCFullYear();
  }

  setFullYear() {
    const args = arguments;
    Date.prototype.setUTCFullYear.apply(this.internal, args);
    this.syncFromInternal();
    return +this;
  }

  setUTCFullYear() {
    const args = arguments;
    this.fixDST(() => Date.prototype.setUTCFullYear.apply(this, args));
    this.syncToInternal();
    return +this;
  }

  //#endregion

  //#region month

  getMonth() {
    return this.internal.getUTCMonth();
  }

  setMonth() {
    Date.prototype.setUTCMonth.apply(this.internal, arguments);
    this.syncFromInternal();
    return +this;
  }

  setUTCMonth() {
    const args = arguments;
    this.fixDST(() => Date.prototype.setUTCMonth.apply(this, args));
    this.syncToInternal();
    return +this;
  }

  //#endregion

  //#region date

  getDate() {
    return this.internal.getUTCDate();
  }

  setDate(date) {
    Date.prototype.setUTCDate.call(this.internal, date);
    this.syncFromInternal();
    return +this;
  }

  setUTCDate(date) {
    this.fixDST(() => Date.prototype.setUTCDate.call(this, date));
    this.syncToInternal();
    return +this;
  }

  //#endregion

  //#region day

  getDay() {
    return this.internal.getUTCDay();
  }

  //#endregion

  //#region hours

  getHours() {
    return this.internal.getUTCHours();
  }

  setHours() {
    const args = arguments;
    Date.prototype.setUTCHours.apply(this.internal, args);
    this.syncFromInternal();
    return +this;
  }

  setUTCHours() {
    const args = arguments;
    Date.prototype.setUTCHours.apply(this, args);
    this.syncToInternal();
    return +this;
  }

  //#endregion

  //#region minutes

  getMinutes() {
    return this.internal.getUTCMinutes();
  }

  setMinutes() {
    const args = arguments;
    Date.prototype.setUTCMinutes.apply(this.internal, args);
    this.syncFromInternal();
    return +this;
  }

  setUTCMinutes() {
    const args = arguments;
    Date.prototype.setUTCMinutes.apply(this, args);
    this.syncToInternal();
    return +this;
  }

  //#endregion

  //#region seconds

  setSeconds() {
    const args = arguments;

    Date.prototype.setUTCSeconds.apply(this.internal, args);
    this.syncFromInternal();
    return +this;
  }

  setUTCSeconds() {
    const args = arguments;
    Date.prototype.setUTCSeconds.apply(this, args);
    this.syncToInternal();
    return +this;
  }

  //#endregion

  //#region milliseconds

  setMilliseconds(ms) {
    Date.prototype.setUTCMilliseconds.call(this, ms);
    this.syncToInternal();
    return +this;
  }

  setUTCMilliseconds(ms) {
    Date.prototype.setUTCMilliseconds.call(this, ms);
    this.syncToInternal();
    return +this;
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

  //#region private

  syncToInternal() {
    this.internal.setTime(+this);
    this.internal.setUTCMinutes(
      this.internal.getUTCMinutes() - this.getTimezoneOffset()
    );
  }

  syncFromInternal() {
    this.setTime(+this.internal);
    // [TODO] Shouldn't I use this.internal here?!
    this.setUTCMinutes(this.getUTCMinutes() + this.getTimezoneOffset());
  }

  fixDST(update) {
    const offset = tzOffset(this.timeZone, this);
    update();
    const newOffset = tzOffset(this.timeZone, this);
    const diff = newOffset - offset;
    if (diff)
      Date.prototype.setUTCMinutes.call(this, this.getUTCMinutes() - diff);
  }

  //#endregion

  //#region date-fns integration

  [constructFromSymbol](date) {
    return new TZDateMini(+new Date(date), this.timeZone);
  }

  //#endregion
}
