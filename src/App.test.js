// import { render, screen } from "@testing-library/react";
import { getDay, getMonth, parseDateString } from "./App.jsx";

describe("Date Functions", () => {
  test("parseDateString creates array of numbers that correspond to date string", () => {
    const input = "2000-12-25";
    const expected = [2000, 11, 25];
    const actual = parseDateString(input);
    expect(actual).toStrictEqual(expected);
  });
  test("getDay returns correct day", () => {
    const input = "2000-12-25";
    const expected = 25;
    const actual = getDay(input).day;
    expect(actual).toBe(expected);
  });
  test("getDay returns correct day of wee", () => {
    const input = "2021-10-01";
    const expected = "Friday";
    const actual = getDay(input).dayOfWeek;

    expect(actual).toBe(expected);
  });
  test("getMonth returns correct month", () => {
    const input = "2000-12-25";
    const expected = "December";
    const actual = getMonth(input);
    expect(actual).toBe(expected);
  });
});
