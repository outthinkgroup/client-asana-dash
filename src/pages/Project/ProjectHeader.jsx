import { useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import AllProjectsLink from "../../components/AllProjectsLink.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import ProjectNavigation from "./ProjectNavigation.jsx";
export default function ProjectHeader({ project }) {
  let { path, url } = useRouteMatch();
  let subslug = parseSubSlug(url);
  if (subslug == "") {
    subslug = "updates";
  }

  return (
    <ProjectHeaderWrapper>
      <div className="wrapper">
        <AllProjectsLink />
        <h1>Out:think Client {subslug}</h1>

        <div className="project-name">
          <h2>{project?.name}</h2>
          <StatusBadge color={project.current_status.color} />
        </div>
      </div>
      <ProjectNavigation path={path} url={url} />
    </ProjectHeaderWrapper>
  );
}

function parseSubSlug() {
  const path = window.location.pathname;
  const parts = path.split("/").filter(Boolean);
  return parts[2] ?? "";
}

const ProjectHeaderWrapper = styled.header`
  background: #eff6ff;

  border-bottom: 1px solid #cee2fb;
  .wrapper {
    padding-inline: 2rem;
    padding-top: 3rem;
    padding-bottom: 2rem;
  }

  .project-name {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 0.25em;
  }

  h1 {
    text-transform: capitalize;
    margin-bottom: 0;
    color: #1e3a8a;
    font-size: 20px;
    font-weight: 700;
  }
  h2 {
    letter-spacing: -1px;
    margin: 0;

    font-size: 36px;
    font-weight: 300;
  }
`;
