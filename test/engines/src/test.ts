import { TZDate } from "../../../src/index.ts";

const date = new TZDate(2022, 2, 13, "Asia/Singapore");
const received = date.toString();
const expected = "Sun Mar 13 2022 00:00:00 GMT+0800 (Singapore Standard Time)";

if (received !== expected) {
  throw new Error(`Expected "${expected}", but got "${received}"`);
}
