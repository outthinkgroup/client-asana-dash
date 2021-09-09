import { useEffect, useState } from "react";
import styled from "styled-components";
function App({ className }) {
  const [project, setProject] = useState(null);
  useEffect(() => {
    getData().then(setProject);
  }, []);
  if (!project) return null;
  return (
    <div className={`App ${className}`}>
      <h1>Outthink Asana Client Dashboard</h1>
      <h2 style={{ textTransform: `uppercase` }}>Project: "PROJECT NAME"</h2>
      <DateGroups>
        {project.datesSorted.map((date) => {
          return (
            <li key={date}>
              <div className="date-group">
                <h3>{date}</h3>
                <ul className="tasks">
                  {project.tasksByDate[date].map((task) => {
                    return (
                      <Task key={task.gid}>
                        <h4>{task.name}</h4>
                        {task.notes && <p>{task.notes}</p>}
                      </Task>
                    );
                  })}
                </ul>
              </div>
            </li>
          );
        })}
        <li>
          <div className="date-group">
            <h3>No date Given</h3>
            <ul className="tasks">
              {project.tasksByDate[0].map((task) => {
                return (
                  <Task key={task.gid}>
                    <h4>{task.name}</h4>
                    <p>{task.notes}</p>
                  </Task>
                );
              })}
            </ul>
          </div>
        </li>
      </DateGroups>
    </div>
  );
}

export default styled(App)`
  padding: 20px;
`;

const DateGroups = styled.ul`
  --border-color: #ddd;
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
    color: #777;
    font-size: 24px;
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
