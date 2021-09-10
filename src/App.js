import { useEffect, useState } from "react";
import styled from "styled-components";

function App({ className }) {
  const [projectData, setProjectData] = useState(null);
  useEffect(() => {
    getData().then(setProjectData);
  }, []);
  if (!projectData) return null;
  const { project, tasks, dates } = projectData;
  console.log(project, tasks);
  return (
    <div className={`App ${className}`}>
      <header>
        <h1>Outthink Asana Client Dashboard</h1>
        <h2>{project.name}</h2>
        <p>
          Created on:{" "}
          {new Date(project.created_at).toLocaleString("default", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </header>
      <div className="wrapper">
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
  console.log(date);
  const month = getMonth(date);
  const day = getDay(date);

  return (
    <div className="date-group">
      <h3>
        {date ? (
          <>
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
                <p>{task.notes}</p>
              </Task>
            );
          })}
      </ul>
    </div>
  );
}

export default styled(App)`
  header {
    padding: 20px;
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
  }

  li:last-of-type .date-group {
    border-bottom: none;
  }
  h3 {
    min-width: 200px;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
    .month {
      color: #444;
    }
    .day {
      font-size: 30px;
      font-weight: 300;
      color: #1e3a8a;
    }
  }
  .tasks {
    display: flex;
    flex-direction: column;
    gap: 20px;
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

function getMonth(dateString) {
  const date = new Date(dateString); // 2009-11-10
  const month = date.toLocaleString("default", { month: "long" });
  return month;
}
function getDay(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  return day;
}
