import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import ProjectStatus from "./ProjectStatus.jsx";

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
                <header>
                  <Link
                    to={{
                      pathname: "/project",
                      search: `?id=${project.gid}`,
                    }}
                  >
                    <h3>{project.name}</h3>
                  </Link>
                  <div class="actions">
                    <button
                      onClick={(e) => {
                        const url = `${window.location.origin}/project/?id=${project.gid}`;
                        e.stopPropagation();
                        copyToClipboard(url);
                      }}
                    >
                      copy link
                    </button>
                    <a
                      style={{ background: `#f9f9f9`, color: `#1e3a8a` }}
                      href={`https://app.asana.com/0/${project.gid}`}
                    >
                      View in asana
                    </a>
                  </div>
                </header>
                <ProjectStatus
                  initialStatus={project.current_status}
                  id={project.gid}
                />
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
  li header {
    background: none;
    margin: 0;
    justify-content: space-between;
    display: flex;
    align-items: center;
  }
  .actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
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
    color: #1e3a8a;
    text-decoration: none;
    &:hover {
      color: black;
    }
  }
  button,
  .actions a {
    font-size: 14px;
    cursor: pointer;
    background: #1e3a8a;
    color: white;
    font-weight: bold;
    border-radius: 6px;
    appearance: none;
    border: 1px solid transparent;
    padding: 4px 8px;
    white-space: nowrap;
    &:hover {
      background: #2e468a;
      color: white;
    }
    &:focus {
      box-shadow: 0 0 0 4px #1e3a8a44;
    }
    &:active {
      transform: translateY(1px);
    }
  }
  li {
    padding: 20px 10px;
    border: 1px solid #ccc;
    display: flex;
    flex-direction: column;
    gap: 5px;
    &:hover {
      background: #eff6ff;
    }
  }
`;

function matchSearch(project, search) {
  if (search.length <= 3) return true;
  return project.name.toLowerCase().includes(search.toLowerCase());
}
function copyToClipboard(str) {
  const el = document.createElement("textarea");
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}
