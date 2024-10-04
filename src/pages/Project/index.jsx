import { useLayoutEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import DotLoader from "react-spinners/DotLoader";

import ShowError from "../../components/ShowError.jsx";
import ProjectOverview from "../../components/ProjectOverview.jsx";
import Timeline from "./TimeLine.jsx";
import { useParams } from "react-router-dom/cjs/react-router-dom.min.js";

const CLIENT_TASK = {
	name: "Client Task",
	trueId: "1200972896299432",
};

// Used for filtering the task list by a custom field value
const filterFunctions = {
	all: () => true,
	client: (task) => isClientTask(task.custom_fields),
	agency: (task) => !isClientTask(task.custom_fields),
};

function Project({ className }) {
	const {id:projectId} = useParams()
	const [projectData, setProjectData] = useState(null);
	const [appError, setAppError] = useState(false);


	useLayoutEffect(() => {
		getData(projectId)
			.then(setProjectData)
			.catch((e) => {
				setAppError(e.toString());
			});
	}, [projectId]);

	console.log({projectData})
	const { project, tasks, updates, brief } = projectData ? projectData : {};

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
			<header>
				<div className="wrapper">
					<h1>Out:think Client Timeline</h1>
					<h2>{project?.name}</h2>
				</div>
			</header>

		<div className="wrapper">
				<ProjectOverview brief={brief} updates={updates} />
			</div>

			<div>

		<Switch>
			<Timeline tasks={tasks}/>
		</Switch>
		</div>

		</div>
	);
}

export default styled(Project)`
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


