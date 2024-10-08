import styled from "styled-components";
import { SidebarLinkWrapper } from "./SidebarLinkWrapper";

export default function ProjectOverviewSidebar({ milestones, attachments }) {
  return (
    <ProjectOverviewSidebarWrapper>
      <div className="sidebar-section">
        <h3>Milestones</h3>
        <ul className="milestones">
          {milestones?.map((milestone) => (
            <li key={milestone.gid}>
              <span>
                <input type="checkbox" readOnly checked={milestone.completed} />
              </span>
              <span>{milestone.name}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="sidebar-section">
        <h3>Project Resources</h3>
        <ul className={"links"}>
          {attachments?.map((attachment) => (
            <li key={attachment.gid}>
              <SidebarLinkWrapper>
                <ProjectResourceLink className="resourcelink" target="_blank" href={attachment.view_url}>
                  {attachment.name}
                </ProjectResourceLink>
              </SidebarLinkWrapper>
            </li>
          ))}
        </ul>
      </div>
    </ProjectOverviewSidebarWrapper>
  );
}

const ProjectOverviewSidebarWrapper = styled.div`

		max-width:320px;
		display:flex;
		flex-direction:column;
		gap:20px;
	}
.sidebar-section {
	h3{
		font-size:16px;
		margin-block:.5em;
	}
	ul{
		list-style:none;
		margin:0;
		padding:0;
	}

	.links {
	
	}

	.milestones{
		li {
			display:flex;
			gap:4px;
			font-size:13px;
		}
	}
}	
`;

export const ProjectResourceLink = styled.a`
&.resourcelink{
	color:var(--primary-color);
	margin-bottom:8px;
	padding-left: 2em;
	position:relative;
  background: #eff6ff;
	&:hover{
		background:var(--border-color);
	}

	&::before {
		content:"";
		position:absolute;
		left:0;
		height:100%;
		top:0;
		width:calc(2em - 8px);
		background-size: 1em;
		background-position:50%;
		background-repeat:no-repeat;
	}
}

  /* Generic External Link Icon */
  &:where([href^="http"]:not([href*="yourdomain.com"]))::before {
		background-image:url(https://upload.wikimedia.org/wikipedia/commons/5/56/Chain_link_icon_slanted.png);
		background-size:.75em;

  }


  /* Add Icons for Specific Links */
  &[href*="google.com"]::before {
		background-image:url(https://www.google.com/favicon.ico);
  }

  &[href*="youtube.com"]::before {
		background-image:url(https://www.youtube.com/s/desktop/e6683cb8/img/favicon.ico);

  }
  &:is([href*="https://outthinkteam.youcanbook.me"],[href*="https://outthink.co/booking"])::before {
		background-image:url(https://w7.pngwing.com/pngs/594/45/png-transparent-square-red-and-white-illustration-calendar-date-computer-icons-time-calendar-icon-miscellaneous-calendar-rectangle-thumbnail.png);

  }
`;
