import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { TZDate, tzOffset, tzScan } from ".";
import FakeTimers from "@sinonjs/fake-timers";

describe("TZDate", () => {
  let timers: FakeTimers.InstalledClock;
  let now = new Date();

  function fakeNow(date = new Date("1987-02-11T00:00:00.000Z")) {
    beforeEach(() => {
      now = date;
      timers = FakeTimers.install({ now });
    });
  }

  afterEach(() => {
    timers?.uninstall();
  });

  describe("constructor", () => {
    fakeNow();

    it("creates a new date", () => {
      const date = new TZDate();
      expect(+date).toBe(+now);
    });

    it("creates a new date within the given timezone", () => {
      {
        const date = new TZDate("Asia/Singapore");
        expect(date.toISOString()).toBe("1987-02-11T08:00:00.000+08:00");
      }
      {
        const date = new TZDate("America/New_York");
        expect(date.toISOString()).toBe("1987-02-10T19:00:00.000-05:00");
      }
    });
  });

  describe("time", () => {
    describe("getTime", () => {
      it("returns the time in the timezone", () => {
        const nativeDate = new Date(2020, 0, 1);
        expect(new TZDate("Asia/Singapore", +nativeDate).getTime()).toBe(
          +nativeDate
        );
        expect(new TZDate("America/New_York", +nativeDate).getTime()).toBe(
          +nativeDate
        );
      });
    });

    describe("setTime", () => {
      it("sets the time in the timezone", () => {
        {
          const nativeDate = new Date(2020, 0, 1);
          const date = new TZDate("Asia/Singapore");
          date.setTime(+nativeDate);
          expect(+date).toBe(+nativeDate);
        }
        {
          const nativeDate = new Date(2020, 0, 1);
          const date = new TZDate("America/New_York");
          date.setTime(+nativeDate);
          expect(+date).toBe(+nativeDate);
        }
      });
    });

    describe("valueOf", () => {
      it("returns the primitive value of the date", () => {
        const nativeDate = new Date(2020, 0, 1);
        expect(new TZDate("Asia/Singapore", +nativeDate).valueOf()).toBe(
          +nativeDate
        );
        expect(new TZDate("America/New_York", +nativeDate).valueOf()).toBe(
          +nativeDate
        );
      });
    });
  });

  describe("year", () => {
    describe("getFullYear", () => {
      it("returns the full year in the timezone", () => {
        expect(tzDate("Asia/Singapore", 2020, 0, 1, 0).getFullYear()).toBe(
          2020
        );
        expect(tzDate("America/New_York", 2020, 0, 1, 0).getFullYear()).toBe(
          2020
        );
      });
    });

    describe("getUTCFullYear", () => {
      it("returns the full year in the UTC timezone", () => {
        expect(tzDate("Asia/Singapore", 2020, 0, 1, 0).getUTCFullYear()).toBe(
          2019
        );
        expect(tzDate("America/New_York", 2020, 0, 1, 0).getUTCFullYear()).toBe(
          2020
        );
      });
    });

    describe("setFullYear", () => {
      it("sets the full year in the timezone", () => {
        {
          const date = tzDate("Asia/Singapore", 2020, 0, 1);
          date.setFullYear(2021);
          expect(date.toISOString()).toBe("2021-01-01T00:00:00.000+08:00");
        }
        {
          const date = tzDate("America/New_York", 2020, 0, 1);
          console.log(date.toISOString());
          date.setFullYear(2021);
          expect(date.toISOString()).toBe("2021-01-01T00:00:00.000-05:00");
        }
      });

      it("returns the timestamp after setting", () => {
        const date = new TZDate("America/New_York");
        expect(date.setFullYear(2020)).toBe(+date);
      });

      it("allows to set the month", () => {
        {
          const date = tzDate("Asia/Singapore", 2020, 0, 1);
          date.setFullYear(2021, 1);
          expect(date.toISOString()).toBe("2021-02-01T00:00:00.000+08:00");
        }
        {
          const date = tzDate("America/New_York", 2020, 0, 1);
          date.setFullYear(2021, 1);
          expect(date.toISOString()).toBe("2021-02-01T00:00:00.000-05:00");
        }
      });

      it("allows to set the month and date", () => {
        {
          const date = tzDate("Asia/Singapore", 2020, 0, 1);
          date.setFullYear(2021, 1, 11);
          expect(date.toISOString()).toBe("2021-02-11T00:00:00.000+08:00");
        }
        {
          const date = tzDate("America/New_York", 2020, 0, 1);
          date.setFullYear(2021, 1, 11);
          expect(date.toISOString()).toBe("2021-02-11T00:00:00.000-05:00");
        }
      });

      it("allows to overflow the month into the future", () => {
        {
          const date = tzDate("Asia/Singapore", 2020, 0, 1);
          date.setFullYear(2021, 15);
          expect(date.toISOString()).toBe("2022-04-01T00:00:00.000+08:00");
        }
        {
          const date = tzDate("America/New_York", 2020, 0, 1);
          date.setFullYear(2021, 15);
          expect(date.toISOString()).toBe("2022-04-01T00:00:00.000-04:00");
        }
      });

      it("allows to overflow the month into the past", () => {
        {
          const date = tzDate("Asia/Singapore", 2020, 0, 1);
          date.setFullYear(2021, -18);
          expect(date.toISOString()).toBe("2019-07-01T00:00:00.000+08:00");
        }
        {
          const date = tzDate("America/New_York", 2020, 0, 1);
          date.setFullYear(2021, -18);
          expect(date.toISOString()).toBe("2019-07-01T00:00:00.000-04:00");
        }
      });

      it("allows to overflow the month and date into the future", () => {
        {
          const date = tzDate("Asia/Singapore", 2020, 0, 1);
          date.setFullYear(2021, 15, 45);
          expect(date.toISOString()).toBe("2022-05-15T00:00:00.000+08:00");
        }
        {
          const date = tzDate("America/New_York", 2020, 0, 1);
          date.setFullYear(2021, 15, 45);
          expect(date.toISOString()).toBe("2022-05-15T00:00:00.000-04:00");
        }
      });

      it("allows to overflow the month and date into the past", () => {
        {
          const date = tzDate("Asia/Singapore", 2020, 0, 1);
          date.setFullYear(2021, -15, -15);
          expect(date.toISOString()).toBe("2019-09-15T00:00:00.000+08:00");
        }
        {
          const date = tzDate("America/New_York", 2020, 0, 1);
          date.setFullYear(2021, -15, -150);
          expect(date.toISOString()).toBe("2019-05-03T00:00:00.000-04:00");
        }
      });
    });

    describe("setUTCFullYear", () => {
      it("sets the full year in the UTC timezone", () => {
        {
          // 2019-12-31 16:00:00 (UTC) -> ...
          const date = tzDate("Asia/Singapore", 2020, 0, 1);
          // ... -> 2020-12-31 16:00:00 (UTC) ->
          date.setUTCFullYear(2020);
          expect(date.toISOString()).toBe("2021-01-01T00:00:00.000+08:00");
        }
        {
          // 2020-01-01 05:00:00 (UTC) -> ...
          const date = tzDate("America/New_York", 2020, 0, 1);
          // ... -> 2020-01-01 05:00:00 (UTC) ->
          date.setUTCFullYear(2020);
          expect(date.toISOString()).toBe("2020-01-01T00:00:00.000-05:00");
        }
      });

      it("returns the timestamp after setting", () => {
        const date = new TZDate("America/New_York");
        expect(date.setUTCFullYear(2020)).toBe(+date);
      });

      it("allows to set the month", () => {
        {
          // 2019-12-31 16:00:00 (UTC) -> ...
          const date = tzDate("Asia/Singapore", 2020, 0, 1);
          // ... -> 2020-01-31 16:00:00 (UTC) -> ...
          date.setUTCFullYear(2020, 0);
          expect(date.toISOString()).toBe("2020-02-01T00:00:00.000+08:00");
        }
        {
          // 2020-01-01 05:00:00 (UTC) -> ...
          const date = tzDate("America/New_York", 2020, 0, 1);
          // ... -> 2020-01-01 05:00:00 (UTC) -> ...
          date.setUTCFullYear(2020, 0);
          expect(date.toISOString()).toBe("2020-01-01T00:00:00.000-05:00");
        }
      });

      it("allows to set the month and date", () => {
        {
          // 2019-12-31 16:00:00 (UTC) -> ...
          const date = tzDate("Asia/Singapore", 2020, 0, 1);
          // ... -> 2020-01-01 16:00:00 (UTC) -> ...
          date.setUTCFullYear(2020, 0, 1);
          expect(date.toISOString()).toBe("2020-01-02T00:00:00.000+08:00");
        }
        {
          // 2020-01-01 05:00:00 (UTC) -> ...
          const date = tzDate("America/New_York", 2020, 0, 1);
          // ... -> 2020-01-01 05:00:00 (UTC) -> ...
          date.setUTCFullYear(2020, 0, 1);
          expect(date.toISOString()).toBe("2020-01-01T00:00:00.000-05:00");
        }
      });

      it("allows to overflow the month into the future", () => {
        {
          // 2019-12-31 16:00:00 (UTC) -> ...
          const date = tzDate("Asia/Singapore", 2020, 0, 1);
          // ... -> 2024-01-31 16:00:00 (UTC) -> ...
          date.setUTCFullYear(2020, 48);
          expect(date.toISOString()).toBe("2024-02-01T00:00:00.000+08:00");
        }
        {
          // 2020-01-01 05:00:00 (UTC) -> ...
          const date = tzDate("America/New_York", 2020, 0, 1);
          // ... -> 2024-01-01 05:00:00 (UTC) -> ...
          date.setUTCFullYear(2020, 48);
          expect(date.toISOString()).toBe("2024-01-01T00:00:00.000-05:00");
        }
      });

      it("allows to overflow the month into the past", () => {
        {
          // 2019-12-31 16:00:00 (UTC) -> ...
          const date = tzDate("Asia/Singapore", 2020, 0, 1);
          // ... -> 2021-03-31 16:00:00 (UTC) -> ...
          date.setUTCFullYear(2020, -8);
          expect(date.toISOString()).toBe("2019-06-01T00:00:00.000+08:00");
        }
        {
          // 2020-01-01 05:00:00 (UTC) -> ...
          const date = tzDate("America/New_York", 2020, 0, 1);
          // ... -> 2019-05-31 16:00:00 (UTC) -> ...
          date.setUTCFullYear(2020, -8);
          expect(date.toISOString()).toBe("2019-05-01T00:00:00.000-04:00");
        }
      });

      it("allows to overflow the month and date into the future", () => {
        {
          // 2019-12-31 16:00:00 (UTC) -> ...
          const date = tzDate("Asia/Singapore", 2020, 0, 1);
          // ... -> 2021-04-14 16:00:00 (UTC) -> ...
          date.setUTCFullYear(2020, 14, 45);
          expect(date.toISOString()).toBe("2021-04-15T00:00:00.000+08:00");
        }
        {
          // 2020-01-01 05:00:00 (UTC) -> ...
          const date = tzDate("America/New_York", 2020, 0, 1);
          // ... -> 2021-04-14 05:00:00 (UTC) -> ...
          date.setUTCFullYear(2020, 14, 45);
          expect(date.toISOString()).toBe("2021-04-14T00:00:00.000-04:00");
        }
      });

      it("allows to overflow the month and date into the past", () => {
        {
          // 2019-12-31 16:00:00 (UTC) -> ...
          const date = tzDate("Asia/Singapore", 2020, 0, 1);
          // ... -> 2019-03-01 16:00:00 (UTC) -> ...
          date.setUTCFullYear(2020, -8, -60);
          expect(date.toISOString()).toBe("2019-03-02T00:00:00.000+08:00");
        }
        {
          // 2020-01-01 05:00:00 (UTC) -> ...
          const date = tzDate("America/New_York", 2020, 0, 1);
          // ... -> 2019-03-01 05:00:00 (UTC) -> ...
          date.setUTCFullYear(2020, -8, -60);
          expect(date.toISOString()).toBe("2019-03-01T00:00:00.000-05:00");
        }
      });
    });
  });

  describe("month", () => {
    describe("getMonth", () => {
      it("returns the month in the timezone", () => {
        expect(tzDate("America/New_York", 2020, 0, 1, 0).getMonth()).toBe(0);
        expect(tzDate("Asia/Singapore", 2020, 0, 1, 0).getMonth()).toBe(0);
      });
    });

    describe("getUTCMonth", () => {
      it("returns the month in the UTC timezone", () => {
        expect(tzDate("America/New_York", 2020, 0, 1, 0).getUTCMonth()).toBe(0);
        expect(tzDate("Asia/Singapore", 2020, 0, 1, 0).getUTCMonth()).toBe(11);
      });
    });

    describe("setMonth", () => {
      it("sets the month in the timezone", () => {
        {
          const date = tzDate("Asia/Singapore", 2020, 0, 1);
          date.setMonth(1);
          expect(date.toISOString()).toBe("2020-02-01T00:00:00.000+08:00");
        }
        {
          const date = tzDate("America/New_York", 2020, 0, 1);
          date.setMonth(1);
          expect(date.toISOString()).toBe("2020-02-01T00:00:00.000-05:00");
        }
      });

      it("returns the timestamp after setting", () => {
        const date = new TZDate("America/New_York");
        expect(date.setMonth(1)).toBe(+date);
      });

      it("allows to set the date", () => {
        {
          const date = tzDate("Asia/Singapore", 2020, 0, 1);
          date.setMonth(1, 11);
          expect(date.toISOString()).toBe("2020-02-11T00:00:00.000+08:00");
        }
        {
          const date = tzDate("America/New_York", 2020, 0, 1);
          date.setMonth(1, 11);
          expect(date.toISOString()).toBe("2020-02-11T00:00:00.000-05:00");
        }
      });

      it("allows to overflow the month into the future", () => {
        {
          const date = tzDate("Asia/Singapore", 2020, 0, 1);
          date.setMonth(15);
          expect(date.toISOString()).toBe("2021-04-01T00:00:00.000+08:00");
        }
        {
          const date = tzDate("America/New_York", 2020, 0, 1);
          date.setMonth(15);
          expect(date.toISOString()).toBe("2021-04-01T00:00:00.000-04:00");
        }
      });

      it("allows to overflow the month into the past", () => {
        {
          const date = tzDate("Asia/Singapore", 2020, 0, 1);
          date.setMonth(-18);
          expect(date.toISOString()).toBe("2018-07-01T00:00:00.000+08:00");
        }
        {
          const date = tzDate("America/New_York", 2020, 0, 1);
          date.setMonth(-18);
          expect(date.toISOString()).toBe("2018-07-01T00:00:00.000-04:00");
        }
      });

      it("allows to overflow the month and date into the future", () => {
        {
          const date = tzDate("Asia/Singapore", 2020, 0, 1);
          date.setMonth(15, 45);
          expect(date.toISOString()).toBe("2021-05-15T00:00:00.000+08:00");
        }
        {
          const date = tzDate("America/New_York", 2020, 0, 1);
          date.setMonth(15, 45);
          expect(date.toISOString()).toBe("2021-05-15T00:00:00.000-04:00");
        }
      });

      it("allows to overflow the month and date into the past", () => {
        {
          const date = tzDate("Asia/Singapore", 2020, 0, 1);
          date.setMonth(-15, -150);
          expect(date.toISOString()).toBe("2018-05-03T00:00:00.000+08:00");
        }
        {
          const date = tzDate("America/New_York", 2020, 0, 1);
          date.setMonth(-15, -150);
          expect(date.toISOString()).toBe("2018-05-03T00:00:00.000-04:00");
        }
      });
    });

    describe("setUTCMonth", () => {
      it("sets the month in the UTC timezone", () => {
        {
          // 2019-12-31 16:00:00 (UTC) -> ...
          const date = tzDate("Asia/Singapore", 2020, 0, 1);
          // ... -> 2019-03-03 16:00:00 (UTC) -> ...
          date.setUTCMonth(1);
          expect(date.toISOString()).toBe("2019-03-04T00:00:00.000+08:00");
        }
        {
          // 2020-01-01 05:00:00 (UTC) -> ...
          const date = tzDate("America/New_York", 2020, 0, 1);
          // ... -> 2020-02-01 05:00:00 (UTC) -> ...
          date.setUTCMonth(1);
          expect(date.toISOString()).toBe("2020-02-01T00:00:00.000-05:00");
        }
      });

      it("returns the timestamp after setting", () => {
        const date = new TZDate("America/New_York");
        expect(date.setUTCMonth(1)).toBe(+date);
      });

      it("allows to set the date", () => {
        {
          // 2019-12-31 16:00:00 (UTC) -> ...
          const date = tzDate("Asia/Singapore", 2020, 0, 1);
          // ... -> 2019-02-11 16:00:00 (UTC) -> ...
          date.setUTCMonth(1, 11);
          expect(date.toISOString()).toBe("2019-02-12T00:00:00.000+08:00");
        }
        {
          // 2020-01-01 05:00:00 (UTC) -> ...
          const date = tzDate("America/New_York", 2020, 0, 1);
          // ... -> 2020-02-11 05:00:00 (UTC) -> ...
          date.setUTCMonth(1, 11);
          expect(date.toISOString()).toBe("2020-02-11T00:00:00.000-05:00");
        }
      });

      it("allows to overflow the month into the future", () => {
        {
          // 2019-12-31 16:00:00 (UTC) -> ...
          const date = tzDate("Asia/Singapore", 2020, 0, 1);
          // ... -> 2023-01-31 16:00:00 (UTC) -> ...
          date.setUTCMonth(48);
          expect(date.toISOString()).toBe("2023-02-01T00:00:00.000+08:00");
        }
        {
          // 2020-01-01 05:00:00 (UTC) -> ...
          const date = tzDate("America/New_York", 2020, 0, 1);
          // ... -> 2024-01-01 05:00:00 (UTC) -> ...
          date.setUTCMonth(48);
          expect(date.toISOString()).toBe("2024-01-01T00:00:00.000-05:00");
        }
      });

      it("allows to overflow the month into the past", () => {
        {
          // 2019-12-31 16:00:00 (UTC) -> ...
          const date = tzDate("Asia/Singapore", 2020, 0, 1);
          // ... -> 2017-07-31 16:00:00 (UTC) -> ...
          date.setUTCMonth(-18);
          expect(date.toISOString()).toBe("2017-08-01T00:00:00.000+08:00");
        }
        {
          // 2020-01-01 05:00:00 (UTC) -> ...
          const date = tzDate("America/New_York", 2020, 0, 1);
          // ... -> 2018-07-01 05:00:00 (UTC) -> ...
          date.setUTCMonth(-18);
          expect(date.toISOString()).toBe("2018-07-01T00:00:00.000-04:00");
        }
      });

      it("allows to overflow the month and date into the future", () => {
        {
          // 2019-12-31 16:00:00 (UTC) -> ...
          const date = tzDate("Asia/Singapore", 2020, 0, 1);
          // ... -> 2020-08-14 16:00:00 (UTC) -> ...
          date.setUTCMonth(18, 45);
          expect(date.toISOString()).toBe("2020-08-15T00:00:00.000+08:00");
        }
        {
          // 2020-01-01 05:00:00 (UTC) -> ...
          const date = tzDate("America/New_York", 2020, 0, 1);
          // ... -> 2021-08-14 05:00:00 (UTC) -> ...
          date.setUTCMonth(18, 45);
          expect(date.toISOString()).toBe("2021-08-14T00:00:00.000-04:00");
        }
      });

      it("allows to overflow the month and date into the past", () => {
        {
          // 2019-12-31 16:00:00 (UTC) -> ...
          const date = tzDate("Asia/Singapore", 2020, 0, 1);
          // ... -> 2017-05-01 16:00:00 (UTC) -> ...
          date.setUTCMonth(-18, -60);
          expect(date.toISOString()).toBe("2017-05-02T00:00:00.000+08:00");
        }
        {
          // 2020-01-01 05:00:00 (UTC) -> ...
          const date = tzDate("America/New_York", 2020, 0, 1);
          // ... -> 2018-05-01 05:00:00 (UTC) -> ...
          date.setUTCMonth(-18, -60);
          expect(date.toISOString()).toBe("2018-05-01T00:00:00.000-04:00");
        }
      });
    });
  });

  describe("date", () => {
    describe("getDate", () => {
      fakeNow();

      it("returns the date in the timezone", () => {
        expect(new TZDate("America/New_York").getDate()).toBe(10);
        expect(new TZDate("Asia/Singapore").getDate()).toBe(11);
      });
    });

    describe("getUTCDate", () => {
      fakeNow();

      it("returns the date in the UTC timezone", () => {
        expect(new TZDate("America/New_York").getUTCDate()).toBe(11);
        expect(new TZDate("Asia/Singapore").getUTCDate()).toBe(11);
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
      fakeNow(new Date("1987-02-10T09:00:00.000Z"));

      it("returns the hours in the timezone", () => {
        expect(new TZDate("Asia/Singapore").getHours()).toBe(17);
        expect(new TZDate("America/New_York").getHours()).toBe(4);
      });
    });

    describe("getUTCHours", () => {
      fakeNow(new Date("1987-02-10T09:00:00.000Z"));

      it("returns the hours in the UTC timezone", () => {
        expect(new TZDate("Asia/Singapore").getUTCHours()).toBe(9);
        expect(new TZDate("America/New_York").getUTCHours()).toBe(9);
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
      fakeNow(new Date("1987-02-10T00:15:00.000Z"));

      it("returns the minutes in the timezone", () => {
        expect(new TZDate("America/New_York").getMinutes()).toBe(15);
        expect(new TZDate("Asia/Kolkata").getMinutes()).toBe(45);
      });
    });

    describe("getUTCMinutes", () => {
      fakeNow(new Date("1987-02-10T00:15:00.000Z"));

      it("returns the minutes in the UTC timezone", () => {
        expect(new TZDate("America/New_York").getUTCMinutes()).toBe(15);
        expect(new TZDate("Asia/Kolkata").getUTCMinutes()).toBe(15);
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
      fakeNow(new Date("1987-02-10T00:00:30.000Z"));

      it("returns the seconds in the timezone", () => {
        expect(new TZDate("America/New_York").getSeconds()).toBe(30);
        expect(new TZDate("Asia/Singapore").getSeconds()).toBe(30);
      });
    });

    describe("getUTCSeconds", () => {
      fakeNow(new Date("1987-02-10T00:00:30.000Z"));

      it("returns the seconds in the UTC timezone", () => {
        expect(new TZDate("America/New_York").getUTCSeconds()).toBe(30);
        expect(new TZDate("Asia/Singapore").getUTCSeconds()).toBe(30);
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
      fakeNow(new Date("1987-02-10T00:00:00.456Z"));

      it("returns the milliseconds in the timezone", () => {
        expect(new TZDate("America/New_York").getMilliseconds()).toBe(456);
        expect(new TZDate("Asia/Singapore").getMilliseconds()).toBe(456);
      });
    });

    describe("getUTCMilliseconds", () => {
      fakeNow(new Date("1987-02-10T00:00:00.456Z"));

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

      it("returns the timestamp after setting", () => {
        const date = new TZDate("America/New_York");
        expect(date.setMilliseconds(987)).toBe(+date);
      });

      it("allows to overflow the seconds into the future", () => {
        {
          const date = tzDate("America/New_York", 2020, 0, 1);
          // 2020-01-01 -> 2020-05-01
          const days = 31 + 29 + 31 + 30;
          const ms = days * 24 * 60 * 60 * 1000;
          date.setMilliseconds(ms);
          expect(date.toISOString()).toBe("2020-05-01T01:00:00.000-04:00");
        }
        {
          const date = tzDate("Asia/Pyongyang", 2015, 7 /* August */, 1);
          // 2015-08-01 -> 2015-09-01
          const ms = 31 * 24 * 60 * 60 * 1000;
          date.setMilliseconds(ms);
          expect(date.toISOString()).toBe("2015-08-31T23:30:00.000+08:30");
        }
      });

      it("allows to overflow the seconds into the past", () => {
        {
          const date = tzDate("America/New_York", 2020, 4, 1);
          // 2020-01-01 <- 2020-05-01
          const days = 31 + 29 + 31 + 30;
          const ms = -days * 24 * 60 * 60 * 1000;
          date.setMilliseconds(ms);
          expect(date.toISOString()).toBe("2019-12-31T23:00:00.000-05:00");
        }
        {
          const date = tzDate("Asia/Pyongyang", 2015, 8 /* September */, 1);
          // 2015-08-01 <- 2015-09-01
          const ms = -31 * 24 * 60 * 60 * 1000;
          date.setMilliseconds(ms);
          expect(date.toISOString()).toBe("2015-08-01T00:30:00.000+09:00");
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
        expect(result).toBe(+date);
        expect(date.toISOString()).toBe("2020-05-01T01:00:00.000-04:00");
      });
    });
  });

  describe("time zone", () => {
    fakeNow();

    describe("withTimeZone", () => {
      it("returns a new date with the given timezone", () => {
        const date = new TZDate("America/New_York");
        const newDate = date.withTimeZone("Asia/Tokyo");

        expect(date.toISOString()).toBe("1987-02-10T19:00:00.000-05:00");
        expect(newDate.toISOString()).toBe("1987-02-11T09:00:00.000+09:00");
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
          new TZDate(
            "America/New_York",
            +new Date("2020-01-01T00:00:00Z")
          ).toDateString()
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
      it("returns string representation of the date in UTC", () => {
        expect(
          new TZDate(
            "America/New_York",
            +new Date("2020-02-11T08:00:00.000Z")
          ).toUTCString()
        ).toBe("Tue, 11 Feb 2020 08:00:00 GMT");
        expect(
          new TZDate(
            "Asia/Singapore",
            +new Date("2020-02-11T08:00:00.000Z")
          ).toUTCString()
        ).toBe("Tue, 11 Feb 2020 08:00:00 GMT");
      });
    });

    describe("toLocaleString", () => {
      it("returns localized date and time in the timezone", () => {
        expect(tzDate("America/New_York", 2020, 0, 1).toLocaleString()).toBe(
          "1/1/2020, 12:00:00 AM"
        );
        expect(
          new TZDate("America/New_York", +new Date(2020, 0, 1)).toLocaleString()
        ).toBe("12/31/2019, 11:00:00 AM");
        expect(
          tzDate("America/New_York", 2020, 5, 1).toLocaleString("es-ES", {
            dateStyle: "full",
            timeStyle: "full",
          })
        ).toBe("lunes, 1 de junio de 2020, 0:00:00 (hora de verano oriental)");
        expect(
          new TZDate(
            "America/New_York",
            +new Date(2020, 0, 1, 10)
          ).toLocaleString("es-ES", {
            dateStyle: "full",
            timeStyle: "full",
          })
        ).toBe(
          "martes, 31 de diciembre de 2019, 21:00:00 (hora estándar oriental)"
        );
        expect(
          new TZDate(
            "America/New_York",
            +new Date(2020, 0, 1, 10)
          ).toLocaleString("es-ES", {
            dateStyle: "full",
            timeStyle: "full",
            timeZone: "Asia/Singapore",
          })
        ).toBe("miércoles, 1 de enero de 2020, 10:00:00 (hora de Singapur)");
      });
    });

    describe("toLocaleDateString", () => {
      it("returns localized date portion of the in the timezone", () => {
        expect(
          tzDate("America/New_York", 2020, 0, 1).toLocaleDateString()
        ).toBe("1/1/2020");
        expect(
          new TZDate(
            "America/New_York",
            +new Date(2020, 0, 1)
          ).toLocaleDateString()
        ).toBe("12/31/2019");
        expect(
          tzDate("America/New_York", 2020, 5, 1).toLocaleDateString("es-ES", {
            dateStyle: "full",
          })
        ).toBe("lunes, 1 de junio de 2020");
        expect(
          new TZDate(
            "America/New_York",
            +new Date(2020, 0, 1, 10)
          ).toLocaleDateString("es-ES", {
            dateStyle: "full",
          })
        ).toBe("martes, 31 de diciembre de 2019");
        expect(
          new TZDate(
            "America/New_York",
            +new Date(2020, 0, 1, 10)
          ).toLocaleDateString("es-ES", {
            dateStyle: "full",
            timeZone: "Asia/Singapore",
          })
        ).toBe("miércoles, 1 de enero de 2020");
      });
    });

    describe("toLocaleTimeString", () => {
      it("returns localized time portion of the in the timezone", () => {
        expect(
          tzDate("America/New_York", 2020, 0, 1).toLocaleTimeString()
        ).toBe("12:00:00 AM");
        expect(
          new TZDate(
            "America/New_York",
            +new Date("2020-02-11T00:00:00.000Z")
          ).toLocaleTimeString()
        ).toBe("11:00:00 AM");
        expect(
          tzDate("America/New_York", 2020, 5, 1).toLocaleTimeString("es-ES", {
            timeStyle: "full",
          })
        ).toBe("0:00:00 (hora de verano oriental)");
        expect(
          new TZDate(
            "America/New_York",
            +new Date(2020, 0, 1, 10)
          ).toLocaleTimeString("es-ES", {
            timeStyle: "full",
          })
        ).toBe("21:00:00 (hora estándar oriental)");
        expect(
          new TZDate(
            "America/New_York",
            +new Date(2020, 0, 1, 10)
          ).toLocaleTimeString("es-ES", {
            timeStyle: "full",
            timeZone: "Asia/Singapore",
          })
        ).toBe("10:00:00 (hora de Singapur)");
      });
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
    const date = new Date("2020-01-15T05:00:00Z");
    expect(tzOffset(undefined, date)).toBe(-date.getTimezoneOffset());
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
  const localOffset = -new Date(
    year,
    month,
    day,
    hours,
    minutes,
    seconds,
    milliseconds
  ).getTimezoneOffset();
  nativeDate.setMinutes(localOffset - offset);
  return new TZDate(timeZone, +nativeDate);
}
