import React, { useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";

import Calendar, { CalendarWrapper } from "./Calendar.js";
import CalendarIcon from "./CalendarIcon.js";

export default function TaskDateRangeCalendar({ startOn, dueOn }) {
  const ref = useRef();
  const [isOpen, setIsOpen] = useState(false);

  useLayoutEffect(() => {
    function watchClickInRef(e) {
      const el = ref?.current;
      if (!el || el.contains(e.target)) {
        return;
      }
      setIsOpen((s) => s && false);
    }
    document.addEventListener("mousedown", watchClickInRef);
    document.addEventListener("touchstart", watchClickInRef);
    return () => {
      document.removeEventListener("mousedown", watchClickInRef);
      document.removeEventListener("touchstart", watchClickInRef);
    };
  }, [ref]);

  return (
    <TaskDateRangeWrapper ref={ref} style={{ "--isOpen": `${isOpen ? 2 : 0}` }}>
      <button onClick={() => setIsOpen((s) => !s)}>
        <CalendarIcon />
      </button>
      {isOpen && <Calendar dateRange={{ start: startOn, end: dueOn }} />}
    </TaskDateRangeWrapper>
  );
}

const TaskDateRangeWrapper = styled.div`
	position:relative;
	z-index:var(--isOpen, 0);
	${CalendarWrapper}{
    position: absolute;
		top:0;
		z-index:9;
		box-shadow: 0 50px 100px rgba(50,50,93,.1), 0 15px 35px rgba(50,50,93,.15), 0 5px 15px rgba(0,0,0,.1);
		border-radius:6px;
		overflow:hidden;
	}

  button {
		position:relative;
		z-index:10;
		border:1px solid #EEF3F8;
		color:#1E3B8A;
    width: 2em;
    height: 2em;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #EEF3F8;
		 * {
			width:100%;
			height:100%;
			display:flex;
			justify-content:center;
			align-items:center;
		}
    &:hover {
      background: #1E3A8A;
			color:white;
    }
  }
  position: relative;
  }
`;
