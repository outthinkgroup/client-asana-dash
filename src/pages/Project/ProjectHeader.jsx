import { useRouteMatch } from "react-router-dom";
import styled from 'styled-components'
import ProjectNavigation from "./ProjectNavigation.jsx";
export default function ProjectHeader({ project }) {
	let { path, url } = useRouteMatch();
	let subslug = parseSubSlug(url)
	if(subslug ==""){
		subslug = "updates"
	}

	return (
		<ProjectHeaderWrapper>
			<ProjectNavigation path={path} url={url} />
			<div className="wrapper">
				<h1>Out:think Client {subslug}</h1>
				<h2>{project?.name}</h2>
			</div>
		</ProjectHeaderWrapper>
	);
}

function parseSubSlug(){
	const path = window.location.pathname;
	const parts = path.split("/").filter(Boolean)
	return parts[2] ?? ""
}

const ProjectHeaderWrapper = styled.header`
	h1 {
		text-transform:capitalize;
	}
`
