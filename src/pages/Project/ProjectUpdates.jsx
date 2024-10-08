import {
  useRouteMatch,
  Switch,
  useParams,
  NavLink,
  Route,
} from "react-router-dom";
import { useMemo } from "react";
import styled from "styled-components";
import AttachmentAndMileStones from "../../components/ProjectOverviewSidebar";
import { SidebarLinkWrapper } from "../../components/SidebarLinkWrapper";
import StatusBadge from "../../components/StatusBadge";

export default function ProjectUpdates({ updates, milestones, attachments }) {
  const { url, path } = useRouteMatch();

  return (
    <ProjectUpdatesWrapper>
      <div>
        <aside>
          <AttachmentAndMileStones
            milestones={milestones}
            attachments={attachments}
          />
          <h3>Past Updates</h3>
          <nav className="updates-nav">
            {updates.map((update) => {
              return (
                <SidebarLinkWrapper key={update.gid}>
                  <NavLink to={`${url}/${update.gid}`}>
                    <span className="date">
                      {formatDate(update.created_at)}
                    </span>
                    <span>{update.title}</span>
                  </NavLink>
                </SidebarLinkWrapper>
              );
            })}
          </nav>
        </aside>
      </div>
      <div className="view-contents contents-container">
        {updates.length == 0 && <p>No Project Updates Yet...</p>}
        <Switch>
          <Route path={`${path}/:updateId`}>
            <ProjectUpdateView updates={updates} />
          </Route>
          <Route path={`${path}`}>
            <ProjectUpdateView updates={updates} />
          </Route>
        </Switch>
      </div>
    </ProjectUpdatesWrapper>
  );
}

const ProjectUpdateView = ({ updates }) => {
  let { updateId } = useParams();
  if (!updateId) {
    updateId = updates[0]?.gid ?? {};
  }

  const update = useMemo(() => {
    return updates.find((update) => update.gid == updateId);
  }, [updateId, updates]);
  console.log(update);
  if (!update) {
    return "";
  }
  return (
    <ProjectUpdateViewWrapper>
      <div className="container">
        <header>
          <h2>{update.title}</h2>
          <div className="meta">
            <p>
              {new Date(update.created_at).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <StatusBadge color={update.color} />
          </div>
        </header>
        <div
          className="update-content"
          dangerouslySetInnerHTML={{ __html: update?.html_text }}
        ></div>
      </div>
    </ProjectUpdateViewWrapper>
  );
};
const ProjectUpdatesWrapper = styled.div`
  display: flex;
  gap: 40px;
  max-width: 1000px;
  margin-inline: auto;
	@media(max-width:500px){
		flex-direction:column-reverse;
	}

  aside {
    height: 100%;
  }

  aside h3 {
    font-size: 16px;
    padding-inline: 10px;
    white-space: nowrap;
  }

  aside nav {
    overflow-y: auto;
    max-height: 100%;
    height: 400px;

    display: flex;
    flex-direction: column;
    max-width: 275px;
    a {
      .date {
        font-size: 12px;
      }
    }
  }
  /** for the milestones **/
  aside li:has(input) {
    padding: 5px 10px;
  }

  .view-contents {
    width: 100%;
		@media(min-width:500px){
			border-left: 1px solid var(--border-color);
		}
    padding-inline: 20px;
    header {
      padding-bottom: 1.75rem;
      border-bottom: 1px solid var(--border-color);
    }
    h2 {
      font-weight: bold;
    }
  }

  .update-content {
    padding-block: 1.75rem;
    line-height: 1.5;
    > p:first-of-type {
      margin-top: 0;
    }
  }
`;

const ProjectUpdateViewWrapper = styled.div`
  flex: 1;
  width: 100%;
  .container {
    margin-inline: auto;
    max-width: 600px;
  }
`;

function formatDate(datestr) {
  return new Date(datestr).toLocaleDateString();
}
