import React from "react";
import styled from "styled-components";

import { dayInMili, getMonthEnd, getMonthStart } from "./dateUtils.js";

const columnCount = 7;
const rowCount = 6;

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thurseday",
  "Friday",
  "Saturday",
];
const OFFSETS = daysOfWeek.reduce((offsets, day, index) => {
  offsets[day] = index;
  return offsets;
}, {});

function getMonthName(date, isLong) {
  return date.toLocaleDateString("default", {
    month: isLong ? "long" : "short",
  });
}

function closestSunday(date) {
  return date;
}
export default function Calendar({ dateRange }) {
  const aDate = new Date(dateRange.start);
  let start, end, lastDay, firstDayOfWeek, days;
  if (dateRange.start.getMonth() === dateRange.end.getMonth()) {
    start = getMonthStart(aDate);
    end = getMonthEnd(aDate);
    lastDay = end.getDate();
    firstDayOfWeek = start.getDay();
    days = Array.from(Array(firstDayOfWeek), (d, i) => (
      <span className="day" key={"e" + i}>
        {""}
      </span>
    ));

    for (let day = 1; day <= lastDay; day++) {
      days.push(
        <span
          className="day"
          key={day}
          style={
            day >= dateRange.start.getDate() && day <= dateRange.end.getDate()
              ? {
                  color: "white",
                  background: "blue",
                  fontWeight: "bold",
                }
              : {}
          }
        >
          {day}
        </span>
      );
    }
  } else {
    const twoWeeks = 15 * dayInMili;
    const sunday = closestSunday(dateRange.start);
    start = new Date(sunday.getTime() - twoWeeks);
    end = new Date(sunday.getTime() + twoWeeks);
    const firstLastDay = getMonthEnd(start).getDate();
    const secondLastDay = end.getDate();

    //Two weeks before start date - start date
    days = Array.from(Array(firstLastDay - start.getDate()), (_, day) => {
      const value = start.getDay() + day;
      return <span className="day">{value}</span>;
    });

    //One day after Start Date = two weeks after
    days.push(
      ...Array.from(Array(secondLastDay), (_, day) => {
        const value = +day % firstLastDay;
        return <span className="day">{value}</span>;
      })
    );
  }

  return (
    <CalendarWrapper style={{ fontSize: 16 }}>
      <header className="month">{getMonthName(start, true)}</header>

      <div className="days">
        <div className="day-labels">
          <span>Su</span>
          <span>M</span>
          <span>T</span>
          <span>W</span>
          <span>Th</span>
          <span>F</span>
          <span>S</span>
        </div>

        <div className="day-cells">{days}</div>
      </div>
    </CalendarWrapper>
  );
}

export const CalendarWrapper = styled.div`
  background: white;
  border: 1px solid #f9f9f9;
  header.month {
    margin: 0;
    text-align: center;
    padding: 0.25em 0;
    font-size: 1em;
  }
  width: 12.5em;
  .day-labels {
    font-size: 0.75em;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    & > * {
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      width: calc(100% / 7);
      aspect-ratio: 1/1;
    }
  }
  .day-cells {
    display: grid;
    grid-auto-rows: r minmax(1px, 1fr));
    grid-template-columns: repeat(${columnCount}, minmax(1px, 1fr));
    justify-content: space-between;
  }
  .day {
    display: flex;
    font-size: 0.6em;
    justify-content: center;
    align-items: center;
    text-align: center;
    aspect-ratio: 1/1;
  }
`;

function createGrid(width, height) {
  const grid = [];
  const total = width * height;
  for (let i = 0; i < total; i++) {
    grid.push(i + 1);
  }
  return grid;
}
