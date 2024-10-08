import styled from "styled-components";
import { NavLink } from "react-router-dom";

export default function ProjectNavigation({ url }) {
	return (
		<ProjectNavigationWrapper>
			<ul>
				<li>
					<NavLink exact to={`${url}`}>Status</NavLink>
				</li>
				<li>
					<NavLink to={`${url}/timeline`}>Timeline</NavLink>
				</li>
				<li>
					<NavLink to={`${url}/brief`}>Brief</NavLink>
				</li>
			</ul>
		</ProjectNavigationWrapper>
	);
}

const ProjectNavigationWrapper = styled.nav`
	display: block;
	border-top:1px solid #CEE2FB;
  & > ul {
		padding-inline:20px;
    max-width: 1000px;
    margin: 0px auto;
    height: 100%;
    list-style: none;
    display: flex;
    font-size: 16px;
    letter-spacing: -0.5px;
  }

  li {
    display: flex;
  }

  li > a {
    text-decoration: none;
    padding: 2rem;
    color: #1e3a8acc;
    font-weight: 700;
    border-top: 1px solid transparent;
    &.active {
      color: #1e3a8a;
      border-top: 1px solid #1e3a8a;
    }
    &:hover {
      color: #1e3a8a;
      border-top: 1px solid #1e3a8a44;
    }
  }
`;
