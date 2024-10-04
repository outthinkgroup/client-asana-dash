import styled from 'styled-components'
export default function ProjectBrief({ brief, attachments, milestones }) {
	return (
		<ProjectBriefWrapper>
			<section className="">
				<div className="container">
					<div dangerouslySetInnerHTML={{ __html: brief?.html }} />
				</div>
			</section>
			<aside>
				<div className="sidebar-section">
					<h3>Milestones</h3>
					<ul>
						{milestones?.map((milestone)=>(
							<li key={milestone.gid}>
								<span>
									<input type="checkbox" readOnly checked={milestone.completed}/>
								</span>
								<span>{milestone.name}</span>
							</li>
						))}
					</ul>
				</div>
				<div className="sidebar-section">
					<h3>Attachments</h3>
					<ul>
						{attachments?.map((attachment)=>(
							<li key={attachment.gid}>
								<a target="_blank" href={attachment.view_url}>{attachment.name}</a>
							</li>
						))}
					</ul>
				</div>
		</aside>
		</ProjectBriefWrapper>
	)
}

const ProjectBriefWrapper = styled.div`
max-width:1000px;
margin-inline:auto;
	display:flex;
.container {
	max-width:800px;
	margin-inline:auto;
}
	section {

		flex:1;
	}

	aside{
		padding-inline:30px;
		max-width:320px;
		border-left:1px solid #EFF6FF;
		display:flex;
		flex-direction:column;
		gap:20px;
	}
.sidebar-section {
	h3{
		font-size:16px;
		margin-block:.25em;
	}
	ul{
		list-style:none;
		margin:0;
		padding:0;

	}
}
`

