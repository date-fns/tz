import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { TZDate, tzOffset, tzScan } from ".";
import FakeTimers from "@sinonjs/fake-timers";

describe("TZDate", () => {
  const defaultMs = 456;
  let timers: FakeTimers.InstalledClock;
  const now = new Date(1987, 1, 11, 0, 0, 0, defaultMs);
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

  describe("time", () => {
    describe("getTime", () => {
      it("returns the time in the timezone", () => {
        const nativeDate = new Date(2020, 0, 1);
        expect(new TZDate("America/New_York", +nativeDate).getTime()).toBe(
          +nativeDate
        );
        expect(new TZDate("Asia/Singapore", +nativeDate).getTime()).toBe(
          +nativeDate
        );
      });
    });

    describe("setTime", () => {
      it.todo("sets the time in the timezone");
    });

    describe("valueOf", () => {
      it("returns the primitive value of the date", () => {
        const nativeDate = new Date(2020, 0, 1);
        expect(new TZDate("America/New_York", +nativeDate).valueOf()).toBe(
          +nativeDate
        );
        expect(new TZDate("Asia/Singapore", +nativeDate).valueOf()).toBe(
          +nativeDate
        );
      });
    });
  });

  describe("year", () => {
    describe("getFullYear", () => {
      it("returns the full year in the timezone", () => {
        expect(
          new TZDate("America/New_York", +new Date(2020, 0, 1, 0)).getFullYear()
        ).toBe(2019);
        expect(tzDate("America/New_York", 2020, 0, 1, 0).getFullYear()).toBe(
          2020
        );
        expect(
          new TZDate("Asia/Singapore", +new Date(2020, 0, 1, 0)).getFullYear()
        ).toBe(2020);
      });
    });

    describe("getUTCFullYear", () => {
      it.todo("returns the full year in the UTC timezone");
    });

    describe("setFullYear", () => {
      it.todo("sets the full year in the timezone");
    });

    describe("setUTCFullYear", () => {
      it.todo("sets the full year in the UTC timezone");
    });

    describe("getYear", () => {
      it.todo("returns the year in the timezone");
    });

    describe("setYear", () => {
      it.todo("sets the year in the timezone");
    });
  });

  describe("month", () => {
    describe("getMonth", () => {
      it("returns the month in the timezone", () => {
        expect(
          new TZDate("America/New_York", +new Date(2020, 0, 1, 0)).getMonth()
        ).toBe(11);
        expect(
          new TZDate("Asia/Singapore", +new Date(2020, 0, 1, 0)).getMonth()
        ).toBe(0);
      });
    });

    describe("getUTCMonth", () => {
      it.todo("returns the month in the UTC timezone");
    });

    describe("setMonth", () => {
      it.todo("sets the month in the timezone");
    });

    describe("setUTCMonth", () => {
      it.todo("sets the month in the UTC timezone");
    });
  });

  describe("date", () => {
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

    describe("setDate", () => {
      it.todo("sets the date in the timezone");
    });

    describe("setUTCDate", () => {
      it.todo("sets the date in the UTC timezone");
    });
  });

  describe("day", () => {
    describe("getDay", () => {
      it.todo("returns the day in the timezone");
    });

    describe("getUTCDay", () => {
      it.todo("returns the day in the UTC timezone");
    });
  });

  describe("hours", () => {
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

    describe("setHours", () => {
      it.todo("sets the hours in the timezone");
    });

    describe("setUTCHours", () => {
      it.todo("sets the hours in the UTC timezone");
    });
  });

  describe("minutes", () => {
    describe("getMinutes", () => {
      it("returns the minutes in the timezone", () => {
        expect(new TZDate("America/New_York").getMinutes()).toBe(0);
        expect(new TZDate("Asia/Kolkata").getMinutes()).toBe(30);
      });
    });

    describe("getUTCMinutes", () => {
      it("returns the minutes in the UTC timezone", () => {
        expect(new TZDate("America/New_York").getUTCMinutes()).toBe(0);
        expect(new TZDate("Asia/Kolkata").getUTCMinutes()).toBe(0);
      });
    });

    describe("setMinutes", () => {
      it.todo("sets the minutes in the timezone");
    });

    describe("setUTCMinutes", () => {
      it.todo("sets the minutes in the UTC timezone");
    });
  });

  describe("seconds", () => {
    describe("getSeconds", () => {
      it("returns the seconds in the timezone", () => {
        expect(new TZDate("America/New_York").getSeconds()).toBe(0);
        expect(new TZDate("Asia/Singapore").getSeconds()).toBe(0);
      });
    });

    describe("getUTCSeconds", () => {
      it("returns the seconds in the UTC timezone", () => {
        expect(new TZDate("America/New_York").getUTCSeconds()).toBe(0);
        expect(new TZDate("Asia/Singapore").getUTCSeconds()).toBe(0);
      });
    });

    describe("setSeconds", () => {
      it.todo("sets the seconds in the timezone");
    });

    describe("setUTCSeconds", () => {
      it.todo("sets the seconds in the UTC timezone");
    });
  });

  describe("milliseconds", () => {
    describe("getMilliseconds", () => {
      it("returns the milliseconds in the timezone", () => {
        expect(new TZDate("America/New_York").getMilliseconds()).toBe(456);
        expect(new TZDate("Asia/Singapore").getMilliseconds()).toBe(456);
      });
    });

    describe("getUTCMilliseconds", () => {
      it("returns the milliseconds in the UTC timezone", () => {
        expect(new TZDate("America/New_York").getUTCMilliseconds()).toBe(456);
        expect(new TZDate("Asia/Singapore").getUTCMilliseconds()).toBe(456);
      });
    });

    describe("setMilliseconds", () => {
      it("sets the milliseconds in the timezone", () => {
        {
          const date = new TZDate("America/New_York");
          date.setMilliseconds(987);
          expect(date.getMilliseconds()).toBe(987);
        }
        {
          const date = new TZDate("Asia/Singapore");
          date.setMilliseconds(987);
          expect(date.getMilliseconds()).toBe(987);
        }
      });

      it("returns milliseconds after setting", () => {
        const date = new TZDate("America/New_York");
        expect(date.setMilliseconds(987)).toBe(987);
      });

      it("allows to overflow the seconds into the future", () => {
        {
          const date = tzDate("America/New_York", 2020, 0, 1);
          // 2020-01-01 -> 2020-05-01
          const days = 31 + 29 + 31 + 30;
          const ms = days * 24 * 60 * 60 * 1000;
          date.setMilliseconds(ms);
          expect(date.getMonth()).toBe(4);
          expect(date.getDate()).toBe(1);
          expect(date.getHours()).toBe(1);
        }
        {
          const date = tzDate("Asia/Pyongyang", 2015, 7 /* August */, 1);
          // 2015-08-01 -> 2015-09-01
          const ms = 31 * 24 * 60 * 60 * 1000;
          date.setMilliseconds(ms);
          expect(date.getMonth()).toBe(7);
          expect(date.getDate()).toBe(31);
          expect(date.getHours()).toBe(23);
          expect(date.getMinutes()).toBe(30);
        }
      });

      it("allows to overflow the seconds into the past", () => {
        {
          const date = tzDate("America/New_York", 2020, 4, 1);
          // 2020-01-01 <- 2020-05-01
          const days = 31 + 29 + 31 + 30;
          const ms = -days * 24 * 60 * 60 * 1000;
          date.setMilliseconds(ms);
          expect(date.getMonth()).toBe(11);
          expect(date.getDate()).toBe(31);
          expect(date.getHours()).toBe(23);
        }
        {
          const date = tzDate("Asia/Pyongyang", 2015, 8 /* September */, 1);
          // 2015-08-01 <- 2015-09-01
          const ms = -31 * 24 * 60 * 60 * 1000;
          date.setMilliseconds(ms);
          expect(date.getMonth()).toBe(7);
          expect(date.getDate()).toBe(1);
          expect(date.getHours()).toBe(0);
          expect(date.getMinutes()).toBe(30);
        }
      });
    });

    describe("setUTCMilliseconds", () => {
      it("works the same as setMilliseconds", () => {
        const date = tzDate("America/New_York", 2020, 0, 1);
        // 2020-01-01 -> 2020-05-01
        const days = 31 + 29 + 31 + 30;
        const ms = days * 24 * 60 * 60 * 1000;
        const result = date.setUTCMilliseconds(ms);
        expect(result).toBe(0);
        expect(date.getMonth()).toBe(4);
        expect(date.getDate()).toBe(1);
        expect(date.getHours()).toBe(1);
      });
    });
  });

  describe("time zone", () => {
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

    describe("getTimezoneOffset", () => {
      it("returns the timezone offset", () => {
        expect(new TZDate("America/New_York").getTimezoneOffset()).toBe(300);
        expect(new TZDate("Asia/Singapore").getTimezoneOffset()).toBe(-480);
      });
    });
  });

  describe("representation", () => {
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

    describe("toISOString", () => {
      it("returns ISO 8601 formatted date in the timezone", () => {
        expect(tzDate("America/New_York", 2020, 0, 1).toISOString()).toBe(
          "2020-01-01T00:00:00.000-05:00"
        );
        expect(tzDate("Asia/Singapore", 2020, 0, 1).toISOString()).toBe(
          "2020-01-01T00:00:00.000+08:00"
        );
        expect(tzDate("Asia/Kolkata", 2020, 0, 1).toISOString()).toBe(
          "2020-01-01T00:00:00.000+05:30"
        );
        expect(tzDate("Asia/Pyongyang", 2015, 7, 1).toISOString()).toBe(
          "2015-08-01T00:00:00.000+09:00"
        );
        expect(tzDate("Asia/Pyongyang", 2015, 8, 1).toISOString()).toBe(
          "2015-09-01T00:00:00.000+08:30"
        );
      });
    });

    describe("toJSON", () => {
      it("works the same as toISOString", () => {
        expect(tzDate("America/New_York", 2020, 0, 1).toJSON()).toBe(
          "2020-01-01T00:00:00.000-05:00"
        );
        expect(tzDate("Asia/Pyongyang", 2015, 7, 1).toJSON()).toBe(
          "2015-08-01T00:00:00.000+09:00"
        );
        expect(tzDate("Asia/Pyongyang", 2015, 8, 1).toJSON()).toBe(
          "2015-09-01T00:00:00.000+08:30"
        );
      });
    });

    describe("toLocaleString", () => {
      it.todo("returns localized date and time in the timezone");
    });

    describe("toLocaleDateString", () => {
      it.todo("returns localized date portion of the in the timezone");
    });

    describe("toLocaleTimeString", () => {
      it.todo("returns localized time portion of the in the timezone");
    });

    describe("toString", () => {
      it("returns string representation of the date in the timezone", () => {
        expect(tzDate("America/New_York", 2020, 0, 1).toString()).toBe(
          "Wed Jan 01 2020 00:00:00 GMT-0500 (Eastern Standard Time)"
        );
        expect(
          new TZDate("America/New_York", +new Date(2020, 0, 1)).toString()
        ).toBe("Tue Dec 31 2019 11:00:00 GMT-0500 (Eastern Standard Time)");
        expect(tzDate("America/New_York", 2020, 5, 1).toString()).toBe(
          "Mon Jun 01 2020 00:00:00 GMT-0400 (Eastern Daylight Time)"
        );
      });
    });

    describe("toDateString", () => {
      it("returns formatted date portion of the in the timezone", () => {
        expect(tzDate("America/New_York", 2020, 0, 1).toDateString()).toBe(
          "Wed Jan 01 2020"
        );
        expect(
          new TZDate("America/New_York", +new Date(2020, 0, 1)).toDateString()
        ).toBe("Tue Dec 31 2019");
      });
    });

    describe("toTimeString", () => {
      it("returns formatted time portion of the in the timezone", () => {
        expect(tzDate("America/New_York", 2020, 0, 1).toTimeString()).toBe(
          "00:00:00 GMT-0500 (Eastern Standard Time)"
        );
        expect(
          new TZDate("America/New_York", +new Date(2020, 0, 1)).toTimeString()
        ).toBe("11:00:00 GMT-0500 (Eastern Standard Time)");
        expect(tzDate("America/New_York", 2020, 5, 1).toTimeString()).toBe(
          "00:00:00 GMT-0400 (Eastern Daylight Time)"
        );
      });
    });

    describe("toUTCString", () => {
      it.todo("returns string representation of the date in UTC");
    });
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

function tzDate(
  timeZone: string,
  year: number,
  month: number,
  day: number,
  hours = 0,
  minutes = 0,
  seconds = 0,
  milliseconds = 0
): TZDate {
  const nativeDate = new Date(
    year,
    month,
    day,
    hours,
    minutes,
    seconds,
    milliseconds
  );
  const offset = tzOffset(timeZone, nativeDate);
  nativeDate.setMinutes(localOffset - offset);
  return new TZDate(timeZone, +nativeDate);
}

const localOffset = 8 * 60;
