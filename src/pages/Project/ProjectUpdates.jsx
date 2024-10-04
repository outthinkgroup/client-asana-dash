import {
	useRouteMatch,
	Switch,
	useParams,
	NavLink,
	Route,
} from "react-router-dom";
import { useMemo } from "react";
import styled from "styled-components";

export default function ProjectUpdates({ updates }) {
	const { url, path } = useRouteMatch();

	return (
		<ProjectUpdatesWrapper>
			<aside>
				<h3 >Past Updates</h3>
				<nav>
					{updates.map((update) => {
						return (
							<NavLink key={update.gid} to={`${url}/${update.gid}`}>
								<span className="date">{formatDate(update.created_at)}</span>
								<span>{update.title}</span>
							</NavLink>
						);
					})}
				</nav>
			</aside>

			<div class="view-contents">
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
				<h2>{update.title}</h2>
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
gap:40px;
  max-width: 1000px;
  margin-inline: auto;

  aside {
    height: 100%;
  }

	aside h3{
		font-size:16px;
		padding-inline:10px;
		white-space:nowrap;
	}

  aside nav {
    overflow-y: auto;
    max-height: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    max-width: 275px;
    a {
      text-decoration: none;
      padding: 10px;
      display: flex;
      flex-direction: column;
			color:#1E3A8A;

      .date {
        font-size: 12px;
      }
			&.active {
				font-weight:bold;
			}
			&:hover{
				background:#EFF6FF;
				border-radius:4px;
			}
    }
  }

.view-contents {
	width:100%;
	border-left:1px solid #EFF6FF;
	padding-inline:20px;
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
