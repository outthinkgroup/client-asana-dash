import React, { useState } from "react";
import styled from "styled-components";

import Calendar, { CalendarWrapper } from "./Calendar.js";
import CalendarIcon from "./CalendarIcon.js";

export default function TaskDateRangeCalendar({ startOn, dueOn }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <TaskDateRangeWrapper>
      <button onClick={() => setIsOpen((s) => !s)}>
        <CalendarIcon />
      </button>
      {isOpen && <Calendar dateRange={{ start: startOn, end: dueOn }} />}
    </TaskDateRangeWrapper>
  );
}

const TaskDateRangeWrapper = styled.div`
	
	${CalendarWrapper}{
    position: absolute;
		z-index:99;
		box-shadow: 0 50px 100px rgba(50,50,93,.1), 0 15px 35px rgba(50,50,93,.15), 0 5px 15px rgba(0,0,0,.1);
		border-radius:6px;
		overflow:hidden;
	}

  button {
		color:#1E3B8A;
    width: 2em;
    height: 2em;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    background: none;
    &:hover {
      background: #EEF3F8;
    }
  }
  position: relative;
  }
`;
