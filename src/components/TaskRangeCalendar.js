import React, { useLayoutEffect, useRef, useState } from "react";
import { Box, IconButton } from "@chakra-ui/react";

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
    <Box ref={ref} style={{ "--isOpen": `${isOpen ? 2 : 0}` }}>
      <IconButton
        isRound
        size="sm"
        color="blue.700"
        bg="blue.50"
        icon={<CalendarIcon />}
        onClick={() => setIsOpen((s) => !s)}
      ></IconButton>
      {isOpen && <Calendar dateRange={{ start: startOn, end: dueOn }} />}
    </Box>
  );
}

// position:relative;
// z-index:var(--isOpen, 0);
// ${CalendarWrapper}{
// position: absolute;
// top:0;
// z-index:9;
// box-shadow: 0 50px 100px rgba(50,50,93,.1), 0 15px 35px rgba(50,50,93,.15), 0 5px 15px rgba(0,0,0,.1);
// border-radius:6px;
// overflow:hidden;
// }

// button {
// position:relative;
// z-index:10;
// border:1px solid #EEF3F8;
// color:#1E3B8A;
// width: 2em;
// height: 2em;
// border-radius: 50%;
// display: flex;
// justify-content: center;
// align-items: center;
// background: #EEF3F8;
// svg{
// position:absolute;
// top:50%;
// left:50%;
// transform:translate(-50%,-50%);
// }
// &:hover {
// background: #1E3A8A;
// color:white;
// }
// }
// position: relative;
// }
// `;
