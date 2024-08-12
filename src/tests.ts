import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { TZDate, tzOffset, tzScan } from ".";
import FakeTimers from "@sinonjs/fake-timers";

describe("TZDate", () => {
  let timers: FakeTimers.InstalledClock;
  const now = new Date(1987, 1, 11, 0, 0, 0, 456);
  beforeEach(() => {
    timers = FakeTimers.install({ now });
    if (now.getUTCHours() !== 16)
      throw new Error("The tests must run with TZ=Asia/Singapore");
  });

  afterEach(() => {
    timers.uninstall();
  });

  describe("constructor", () => {
    it("creates a new date", () => {
      const date = new TZDate();
      expect(date.getDate()).toBe(11);
    });

    it("creates a new date within the given timezone", () => {
      const date = new TZDate("America/New_York");
      expect(date.getDate()).toBe(10);
      expect(date.getHours()).toBe(11);
    });
  });

  describe("withTimeZone", () => {
    it("returns a new date with the given timezone", () => {
      const date = new TZDate("America/New_York");
      expect(date.getDate()).toBe(10);
      expect(date.getHours()).toBe(11);

      const newDate = date.withTimeZone("Asia/Tokyo");

      expect(newDate.getDate()).toBe(11);
      expect(newDate.getHours()).toBe(1);
    });
  });

  describe("getDate", () => {
    it("returns the date in the timezone", () => {
      expect(new TZDate("America/New_York").getDate()).toBe(10);
      expect(new TZDate("Asia/Singapore").getDate()).toBe(11);
    });
  });

  describe("getUTCDate", () => {
    it("returns the date in the UTC timezone", () => {
      expect(new TZDate("America/New_York").getUTCDate()).toBe(10);
      expect(new TZDate("Asia/Singapore").getUTCDate()).toBe(10);
    });
  });

  describe("getDay", () => {
    it.todo("returns the day in the timezone");
  });

  describe("getUTCDay", () => {
    it.todo("returns the day in the UTC timezone");
  });

  describe("getFullYear", () => {
    it.todo("returns the full year in the timezone");
  });

  describe("getUTCFullYear", () => {
    it.todo("returns the full year in the UTC timezone");
  });

  describe("getHours", () => {
    it("returns the hours in the timezone", () => {
      expect(new TZDate("America/New_York").getHours()).toBe(11);
      expect(new TZDate("Asia/Singapore").getHours()).toBe(0);
    });
  });

  describe("getUTCHours", () => {
    it("returns the hours in the UTC timezone", () => {
      expect(new TZDate("America/New_York").getUTCHours()).toBe(16);
      expect(new TZDate("Asia/Singapore").getUTCHours()).toBe(16);
    });
  });

  describe("getMilliseconds", () => {
    it.todo("returns the milliseconds in the timezone");
  });

  describe("getUTCMilliseconds", () => {
    it.todo("returns the milliseconds in the UTC timezone");
  });

  describe("getMinutes", () => {
    it.todo("returns the minutes in the timezone");
  });

  describe("getUTCMinutes", () => {
    it.todo("returns the minutes in the UTC timezone");
  });

  describe("getMonth", () => {
    it.todo("returns the month in the timezone");
  });

  describe("getUTCMonth", () => {
    it.todo("returns the month in the UTC timezone");
  });

  describe("getSeconds", () => {
    it.todo("returns the seconds in the timezone");
  });

  describe("getUTCSeconds", () => {
    it.todo("returns the seconds in the UTC timezone");
  });

  describe("getTime", () => {
    it.todo("returns the time in the timezone");
  });

  describe("getTimezoneOffset", () => {
    it("returns the timezone offset", () => {
      expect(new TZDate("America/New_York").getTimezoneOffset()).toBe(-300);
      expect(new TZDate("Asia/Singapore").getTimezoneOffset()).toBe(480);
    });
  });

  describe("getYear", () => {
    it.todo("returns the year in the timezone");
  });

  describe("setDate", () => {
    it.todo("sets the date in the timezone");
  });

  describe("setUTCDate", () => {
    it.todo("sets the date in the UTC timezone");
  });

  describe("setFullYear", () => {
    it.todo("sets the full year in the timezone");
  });

  describe("setUTCFullYear", () => {
    it.todo("sets the full year in the UTC timezone");
  });

  describe("setHours", () => {
    it.todo("sets the hours in the timezone");
  });

  describe("setUTCHours", () => {
    it.todo("sets the hours in the UTC timezone");
  });

  describe("setMilliseconds", () => {
    it.todo("sets the milliseconds in the timezone");
  });

  describe("setUTCMilliseconds", () => {
    it.todo("sets the milliseconds in the UTC timezone");
  });

  describe("setMinutes", () => {
    it.todo("sets the minutes in the timezone");
  });

  describe("setUTCMinutes", () => {
    it.todo("sets the minutes in the UTC timezone");
  });

  describe("setMonth", () => {
    it.todo("sets the month in the timezone");
  });

  describe("setUTCMonth", () => {
    it.todo("sets the month in the UTC timezone");
  });

  describe("setSeconds", () => {
    it.todo("sets the seconds in the timezone");
  });

  describe("setUTCSeconds", () => {
    it.todo("sets the seconds in the UTC timezone");
  });

  describe("setTime", () => {
    it.todo("sets the time in the timezone");
  });

  describe("setYear", () => {
    it.todo("sets the year in the timezone");
  });

  describe("[Symbol.toPrimitive]", () => {
    it.todo(
      "returns string representation of the date when the hint is 'string'"
    );

    it.todo(
      "returns string representation of the date when the hint is 'default'"
    );

    it.todo(
      "returns number representation of the date when the hint is 'number'"
    );
  });

  describe("toDateString", () => {
    it.todo("returns formatted date portion of the in the timezone");
  });

  describe("toISOString", () => {
    it.todo("returns ISO 8601 formatted date in UTC");
  });

  describe("toJSON", () => {
    it.todo("returns ISO 8601 formatted date in UTC");
  });

  describe("toLocaleDateString", () => {
    it.todo("returns localized date portion of the in the timezone");
  });

  describe("toLocaleString", () => {
    it.todo("returns localized date and time in the timezone");
  });

  describe("toLocaleTimeString", () => {
    it.todo("returns localized time portion of the in the timezone");
  });

  describe("toString", () => {
    it.todo("returns string representation of the date in the timezone");
  });

  describe("toTimeString", () => {
    it.todo("returns formatted time portion of the in the timezone");
  });

  describe("toUTCString", () => {
    it.todo("returns string representation of the date in UTC");
  });

  describe("valueOf", () => {
    it.todo("returns the primitive value of the date");
  });
});

describe("tzScan", () => {
  it("searches for DST changes in the given period", () => {
    const changes = tzScan("America/New_York", {
      start: new Date("2020-01-01T00:00:00Z"),
      end: new Date("2021-12-31T00:00:00Z"),
    });

    expect(changes).toEqual([
      {
        date: new Date("2020-03-08T07:00:00.000Z"),
        change: 1 * 60,
        offset: -4 * 60,
      },
      {
        date: new Date("2020-11-01T06:00:00.000Z"),
        change: -1 * 60,
        offset: -5 * 60,
      },
      {
        date: new Date("2021-03-14T07:00:00.000Z"),
        change: 1 * 60,
        offset: -4 * 60,
      },
      {
        date: new Date("2021-11-07T06:00:00.000Z"),
        change: -1 * 60,
        offset: -5 * 60,
      },
    ]);
  });

  it("searches for permanent DST changes in the given period", () => {
    const changes = tzScan("Turkey", {
      start: new Date("2015-01-01T00:00:00Z"),
      end: new Date("2018-12-31T00:00:00Z"),
    });

    expect(changes).toEqual([
      {
        date: new Date("2015-03-29T01:00:00.000Z"),
        change: 1 * 60,
        offset: 3 * 60,
      },
      {
        date: new Date("2015-11-08T01:00:00.000Z"),
        change: -1 * 60,
        offset: 2 * 60,
      },
      {
        date: new Date("2016-03-27T01:00:00.000Z"),
        change: 1 * 60,
        offset: 3 * 60,
      },
    ]);
  });

  it("searches for timezone changes", () => {
    const changes = tzScan("Asia/Pyongyang", {
      start: new Date("2010-01-01T00:00:00Z"),
      end: new Date("2019-12-31T00:00:00Z"),
    });

    expect(changes).toEqual([
      {
        date: new Date("2015-08-14T15:00:00.000Z"),
        change: -0.5 * 60,
        offset: 8.5 * 60,
      },
      {
        date: new Date("2018-05-04T15:00:00.000Z"),
        change: 0.5 * 60,
        offset: 9 * 60,
      },
    ]);
  });

  it("searches for huge timezone changes", () => {
    const changes = tzScan("Pacific/Apia", {
      start: new Date("2010-01-01T00:00:00Z"),
      end: new Date("2012-12-31T00:00:00Z"),
    });

    expect(changes).toEqual([
      {
        date: new Date("2010-09-26T11:00:00.000Z"),
        change: 1 * 60,
        offset: -10 * 60,
      },
      {
        date: new Date("2011-04-02T14:00:00.000Z"),
        change: -1 * 60,
        offset: -11 * 60,
      },
      {
        date: new Date("2011-09-24T14:00:00.000Z"),
        change: 1 * 60,
        offset: -10 * 60,
      },
      {
        date: new Date("2011-12-30T10:00:00.000Z"),
        change: 24 * 60,
        offset: 14 * 60,
      },
      {
        date: new Date("2012-03-31T14:00:00.000Z"),
        change: -1 * 60,
        offset: 13 * 60,
      },
      {
        date: new Date("2012-09-29T14:00:00.000Z"),
        change: 1 * 60,
        offset: 14 * 60,
      },
    ]);
  });
});

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
    expect(tzOffset(undefined, new Date("2020-01-15T05:00:00Z"))).toBe(8 * 60);
  });
});
