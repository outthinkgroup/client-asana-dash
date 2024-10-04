import { useLayoutEffect, useState } from "react";

import {
	Route,
	Switch,
	Redirect,
	useRouteMatch,
	useParams,
} from "react-router-dom";
import styled from "styled-components";
import DotLoader from "react-spinners/DotLoader";
import ProjectBrief from "./ProjectBrief.jsx"
import ProjectUpdates from "./ProjectUpdates.jsx";
import ShowError from "../../components/ShowError.jsx";
import ProjectHeader from "./ProjectHeader.jsx";
import Timeline from "./TimeLine.jsx";


function Project({ className }) {
	const { id: projectId } = useParams();
	let { path, url } = useRouteMatch();

	const [projectData, setProjectData] = useState(null);
	const [appError, setAppError] = useState(false);

	console.log(projectData)
	useLayoutEffect(() => {
		getData(projectId)
			.then(setProjectData)
			.catch((e) => {
				setAppError(e.toString());
			});
	}, [projectId]);

	const { project, tasks, updates, brief, milestones, attachments } = projectData ? projectData : {};

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
	return (
		<div className={`App ${className}`}>

			<ProjectHeader project={project}/>

			<div>
				<Switch>

					<Route path={`${path}`} exact>
						<Redirect to={`${url}/updates`} />
					</Route>

					<Route path={`${path}/updates`}>
						<ProjectUpdates updates={updates}/>
					</Route>

					<Route path={`${path}/timeline`}>
						<Timeline tasks={tasks} />
					</Route>

					<Route path={`${path}/brief`}>
						<ProjectBrief brief={brief}	milestones={milestones} attachments={attachments}/>
					</Route>
				</Switch>
			</div>
		</div>
	);
}

export default styled(Project)`
  header {
    background: #eff6ff;
		
		border-bottom:1px solid #CEE2FB;

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
    margin-bottom: 40px;
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

  .special-identifier-icon {
    height: 1em;
    color: var(--special-color);
    @media (min-width: 762px) {
      position: absolute;
      right: calc(100% + 8px);
      top: 4px;
    }
    @media (max-width: 760px) {
      display: flex;
      align-items: center;
      gap: 4px;
      &::after {
        content: attr(title);
        font-weight: bold;
      }
    }

    svg {
      width: 1em;
    }
  }
  .key .special-identifier-icon {
    position: relative;
    right: unset;
    top: unset;
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

async function getData(projectId) {
	if (projectId) {
		return fetch(
			`${window.location.origin}/api/get-project?project=${projectId}`,
		).then((res) => res.json());
	} else {
		throw new Error("No Project found");
	}
}
