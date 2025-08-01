import { describe, expect, it } from "vitest";
import { tzName } from "./index.ts";

describe("tzName", () => {
  const dateStr = "2020-01-01T00:00:00.000Z";
  it("creates returns time zone name", () => {
    expect(tzName("Asia/Singapore", new Date(dateStr))).toBe(
      "Singapore Standard Time"
    );
    expect(tzName("America/New_York", new Date(dateStr))).toBe(
      "Eastern Standard Time"
    );
  });
});
