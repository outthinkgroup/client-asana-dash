import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
function ProjectList({ className }) {
  const [projects, setProjects] = React.useState([]);
  const [search, setSearch] = React.useState("");
  React.useEffect(() => {
    getProjects().then((res) => setProjects(res));
  }, []);
  return (
    <>
      <label
        htmlFor="search"
        style={{ marginBottom: 20, display: "flex", gap: 8 }}
      >
        <span style={{ fontWeight: 600 }}>Search Projects by name</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          id="search"
        />
      </label>
      <ul className={className}>
        {projects
          .filter((proj) => matchSearch(proj, search))
          .map((project) => {
            return (
              <li key={project.gid}>
                <Link
                  to={{
                    pathname: "/project",
                    search: `?id=${project.gid}`,
                  }}
                >
                  <h3>{project.name}</h3>
                  {project.current_status?.title && (
                    <>
                      <h4>{project.current_status.title}</h4>
                      <p>{project.current_status?.text}</p>
                    </>
                  )}
                </Link>
              </li>
            );
          })}
      </ul>
    </>
  );
}

async function getProjects() {
  return fetch(`${window.location.origin}/api/list-projects`).then((res) =>
    res.json()
  );
}
export default styled(ProjectList)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
  h3 {
    margin: 0;
    margin-bottom: 1em;
  }
  h4 {
    font-size: 16px;
    margin: 0;
  }
  p {
    margin: 0;
    font-size: 14px;
  }
  a {
    padding: 20px 10px;
    color: inherit;
    text-decoration: none;
    &:hover {
      background: #eff6ff;
    }
  }
  li > a {
    border: 1px solid #ccc;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
`;

function matchSearch(project, search) {
  if (search.length <= 3) return true;
  return project.name.toLowerCase().includes(search.toLowerCase());
}
