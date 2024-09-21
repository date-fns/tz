import { describe, expect, it } from "vitest";
import { tzOffset } from "./index.ts";

describe("tzOffset", () => {
  it("returns the timezone offset for the given date", () => {
    const date = new Date("2020-01-15T00:00:00Z");
    expect(tzOffset("America/New_York", date)).toBe(-5 * 60);
    expect(tzOffset("Asia/Pyongyang", date)).toBe(9 * 60);
    expect(tzOffset("Asia/Kathmandu", date)).toBe(345);
  });

  it("works at the end of the day", () => {
    const date = new Date("2020-01-15T23:59:59Z");
    expect(tzOffset("America/New_York", date)).toBe(-5 * 60);
    expect(tzOffset("Asia/Pyongyang", date)).toBe(9 * 60);
    expect(tzOffset("Asia/Kathmandu", date)).toBe(345);
  });

  it("works at the end of a month", () => {
    const date = new Date("2020-01-31T23:59:59Z");
    expect(tzOffset("America/New_York", date)).toBe(-5 * 60);
    expect(tzOffset("Asia/Pyongyang", date)).toBe(9 * 60);
    expect(tzOffset("Asia/Kathmandu", date)).toBe(345);
  });

  it("works at midnight", () => {
    expect(tzOffset("America/New_York", new Date("2020-01-15T05:00:00Z"))).toBe(
      -5 * 60
    );
  });

  it("returns the local timezone offset when the timezone is undefined", () => {
    const date = new Date("2020-01-15T05:00:00Z");
    expect(tzOffset(undefined, date)).toBe(-date.getTimezoneOffset());
  });

  it("returns 0 if the offset is 0", () => {
    const date = new Date("2020-01-15T00:00:00Z");
    expect(tzOffset("Europe/London", date)).toBe(0);
  });

  it("returns NaN if the offset the date or time zone are invalid", () => {
    expect(tzOffset("Etc/Invalid", new Date("2020-01-15T00:00:00Z"))).toBe(NaN);
    expect(tzOffset("America/New_York", new Date(NaN))).toBe(NaN);
  });

  describe("fractional time zones", () => {
    it("works negative fractional time zones", () => {
      const dst = new Date("2023-03-15T18:00:00.000Z");
      const date = new Date("2023-03-03T18:00:00.000Z");
      expect(tzOffset("America/St_Johns", dst)).toBe(-150);
      expect(tzOffset("America/St_Johns", date)).toBe(-210);
    });

    it("works positive fractional time zones", () => {
      const dst = new Date("2024-04-06T16:00:00.000Z");
      const date = new Date("2024-04-06T16:30:00.000Z");
      expect(tzOffset("Australia/Adelaide", dst)).toBe(630);
      expect(tzOffset("Australia/Adelaide", date)).toBe(570);
    });
  });
});
