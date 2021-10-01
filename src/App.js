import { useEffect, useState } from "react";
import styled from "styled-components";
import DotLoader from "react-spinners/DotLoader";
import ShowError from "./ShowError.js";

function App({ className }) {
  const [projectData, setProjectData] = useState(null);
  const [appError, setAppError] = useState(false);
  useEffect(() => {
    getData()
      .then(setProjectData)
      .catch((e) => {
        console.log("caught", e);
        setAppError(e.toString());
      });
  }, []);
  if (!projectData) {
    return (
      <LoaderFrame>
        {appError ? (
          <ShowError message={appError} />
        ) : (
          <DotLoader color={"#1E3A8A"} />
        )}
      </LoaderFrame>
    );
  }
  const { project, tasks, dates } = projectData;
  console.log(project);
  return (
    <div className={`App ${className}`}>
      <header>
        <div className="wrapper">
          <h1>Outthink Asana Client Dashboard</h1>
          <h2>{project?.name}</h2>
        </div>
      </header>

      <div className="wrapper">
        {project.current_status && (
          <>
            <p className="heading-label">Status</p>
            <h2>{project.current_status?.title}</h2>
          </>
        )}
        <DateGroups>
          {dates.map((date) => {
            return (
              <li key={date}>
                <TaskGroup date={date} tasks={tasks[date]} />
              </li>
            );
          })}
          <li>{tasks[0] && <TaskGroup tasks={tasks[0]} />}</li>
        </DateGroups>
      </div>
    </div>
  );
}

function TaskGroup({ tasks, date }) {
  const month = getMonth(date);
  const { day, dayOfWeek } = getDay(date);
  return (
    <div className="date-group">
      <h3>
        {date ? (
          <>
            <span>
              <div className="dayofweek">{dayOfWeek}</div>
            </span>
            <div className="day">{day}</div>
            <span className="month">{month}</span>
          </>
        ) : (
          "No Date Given"
        )}
      </h3>
      <ul className="tasks">
        {tasks &&
          tasks.map((task) => {
            return (
              <Task key={task.gid}>
                <h4>{task.name}</h4>
                <div>
                  <DateRange task={task} />
                </div>
                <p>{task.notes}</p>
              </Task>
            );
          })}
      </ul>
    </div>
  );
}
function DateRange({ task }) {
  return task.start_on ? (
    <div className="date-range">
      <span>
        {getMonth(task.start_on, false)} {getDay(task.start_on).day}
      </span>{" "}
      -
      <span>
        {" "}
        {getMonth(task.due_on, false)} {getDay(task.due_on).day}
      </span>
    </div>
  ) : null;
}

export default styled(App)`
  header {
    background: #eff6ff;

    h1 {
      color: #1e3a8a;
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 0.4em;
    }
    h2 {
      margin-top: 0;
      font-size: 30px;
      font-weight: 300;
    }
    margin-bottom: 60px;
  }
  .wrapper {
    padding: 20px;
    max-width: 1000px;
    margin: 0 auto;
  }
  .heading-label {
    font-size: 13px;
    margin-bottom: 0.4em;
    font-weight: bold;
    color: #1e3a8a;
    display: inline-block;
    background: #eff6ff;
    padding: 5px;
    border-radius: 6px;
    & + {
      h2,
      h3,
      h4,
      h5 {
        margin-top: 0px;
      }
    }
  }
`;

const DateGroups = styled.ul`
  --border-color: #ddd;
  > li:nth-child(even) {
    background: #f8fbff;
  }
  list-style: none;
  border: 1px solid var(--border-color);
  margin: 0;
  padding: 0;
  li {
    padding: 0;
  }

  .date-group {
    display: flex;
    border-bottom: 1px solid var(--border-color);
    padding: 20px;
    gap: 40px;
    @media (max-width: 762px) {
      flex-direction: column;
    }
  }

  li:last-of-type .date-group {
    border-bottom: none;
  }
  h3 {
    min-width: 200px;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: px;
    .dayofweek {
      font-size: 10px;
      font-weight: bold;
      color: #1e3a8a;
      width: auto;
      display: inline-block;
      border: 1px solid currentColor;
      padding: 3px 5px;
      border-radius: 6px;
    }
    .month {
      color: #444;
    }
    .day {
      font-size: 38px;
      font-weight: 300;
      color: #1e3a8a;
    }
  }
  .tasks {
    margin-inline: 0;
    padding-inline: 0;
    display: flex;
    flex-direction: column;
    gap: 24px;
    h4 {
      margin-block: 0;
    }
    p {
      font-size: 14px;
      margin-bottom: 0;
    }
  }
`;

const Task = styled.li`
  list-style: none;
  display: flex;
  gap: 8px;
  flex-direction: column;
  > * {
    margin: 0;
  }
  .date-range {
    background: #aac0de33;
    font-size: 12px;
    text-transform: uppercase;
    font-weight: bold;
    padding: 2px 4px;
    border-radius: 6px;
    color: #1e3a8a;
    display: inline-block;
  }
`;

const LoaderFrame = styled.div`
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  background: #eff6ff;
  height: 100vh;
  display: grid;
  place-items: center;
`;

async function getData() {
  const projId = getProjId();
  return fetch(
    `${window.location.origin}/api/get-project?project=${projId}`
  ).then((res) => res.json());
}
function getProjId() {
  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has("project")) {
    return searchParams.get("project");
  }
  throw new Error("No project found");
}

export function getMonth(dateString, isLong = true) {
  const dateArr = parseDateString(dateString);
  const date = new Date(...dateArr); // 2009-11-10
  const month = date.toLocaleString("default", {
    month: isLong ? "long" : "short",
  });
  return month;
}
export function getDay(dateString, isLong = true) {
  const dateArr = parseDateString(dateString);
  console.log(dateArr);
  const date = new Date(...dateArr);
  console.log(date);
  const day = date.getDate();
  const dayOfWeek = date.toLocaleString("default", {
    weekday: isLong ? "long" : "short",
  });
  return { day, dayOfWeek };
}
export function parseDateString(dateString) {
  const [year, day, month] = dateString.split("-");
  return [Number(year), Number(day) - 1, Number(month)];
}
