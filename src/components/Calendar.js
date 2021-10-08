import React from "react";
import styled from "styled-components";

import {
  dayInMili,
  getMonthEnd,
  getMonthStart,
  monthInMili,
} from "../dateUtils.js";

const columnCount = 7;

function getMonthName(date, isLong) {
  return date.toLocaleDateString("default", {
    month: isLong ? "long" : "short",
  });
}
function getMonthRange(start, end) {
  return `${getMonthName(start, false)} - ${getMonthName(end, false)}`;
}

export default function Calendar({ dateRange }) {
  const startOfWork = dateRange.start;
  const endOfWork = dateRange.end;
  const isMultiMonthRange = startOfWork.getMonth() !== endOfWork.getMonth();

  const days = getDays(startOfWork, endOfWork);

  return (
    <CalendarWrapper style={{ fontSize: 16 }}>
      <header className="month">
        {isMultiMonthRange
          ? getMonthRange(startOfWork, endOfWork)
          : getMonthName(startOfWork, true)}
      </header>

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
	  color:#1E3A8A;
		font-weight:bold;
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
		height:100%;
  }
	.day.in-range{
		background:#EEF3F8;
		color:#1E3A8A;
		font-weight:900;
	}
	.day.start-range{
		border-top-left-radius:4px;
		border-bottom-left-radius:4px;
		background:hsl(210, 42%, 85%);
	}
	.day.end-range{
		border-top-right-radius:4px;
		border-bottom-right-radius:4px;
		background:hsl(210, 42%, 85%);
	}
`;

function getDays(rangeStart, rangeEnd) {
  const start = {
    date: rangeStart,
    monthStart: getMonthStart(rangeStart),
    monthEnd: getMonthEnd(rangeStart),
  };

  const end = {
    date: rangeEnd,
    monthStart: getMonthStart(rangeEnd),
    monthEnd: getMonthEnd(rangeEnd),
  };

  const isMultiMonth = start.date.getMonth() !== end.date.getMonth();

  const calcStartDate = isMultiMonth
    ? new Date(end.date.getTime() - (monthInMili(end.date) - dayInMili))
    : start.monthStart;
  calcStartDate.setHours(0, 0, 0, 0);

  const calcStartDay = calcStartDate.getDay();

  const totalDays = isMultiMonth
    ? start.monthEnd.getDate() -
      calcStartDate.getDate() +
      end.date.getDate() +
      1
    : end.monthEnd.getDate();

  return Array.from(Array(totalDays + calcStartDay), (_, index) => {
    if (index < calcStartDay) {
      return (
        <span key={index} className="day">
          {""}
        </span>
      );
    }

    const date = new Date(calcStartDate.getTime());
    date.setDate(calcStartDate.getDate() + index - calcStartDay);

    const isInRange =
      date.getTime() >= rangeStart.getTime() &&
      date.getTime() <= rangeEnd.getTime();

    const isStart = date.getTime() === rangeStart.getTime();
    const isEnd = date.getTime() === rangeEnd.getTime();

    return (
      <span
        className={`day ${isInRange ? `in-range` : ""} ${
          isStart ? `start-range` : ""
        } ${isEnd ? `end-range` : ""}`}
        key={index}
      >
        {date.getDate()}
      </span>
    );
  });
}
