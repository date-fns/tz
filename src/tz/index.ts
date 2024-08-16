import { TZDate } from "../date/index.js";

export const tz = (name: string) => (value: Date | number | string) =>
  TZDate.TZ(name, +new Date(value));
