import styled from "styled-components";
import AttachmentsAndMilestones from "../../components/ProjectOverviewSidebar";
export default function ProjectBrief({ brief, attachments, milestones }) {
  return (
    <ProjectBriefWrapper>
      <section className="">
        <div className="content-container">
          <div
            dangerouslySetInnerHTML={{
              __html:
                brief?.html ??
                "<p style='color:#3e597d; text-align:center;' >Coming Soon...</p>",
            }}
          ></div>
        </div>
      </section>
      <aside>
        <AttachmentsAndMilestones
          milestones={milestones}
          attachments={attachments}
        />
      </aside>
    </ProjectBriefWrapper>
  );
}

const ProjectBriefWrapper = styled.div`
  max-width: 1000px;
  margin-inline: auto;
  display: flex;

  @media (max-width: 700px) {
    flex-direction: column;
  }

  .content-container {
    max-width: 800px;
    margin-inline: auto;
    padding-block: 0.25rem;
		padding-inline:1em;
    @media (max-width: 700px) {
      padding-block: 0.5rem;
      border-bottom: 1px solid var(--border-color);
    }
  }
  section {
    flex: 1;
  }

  aside {
    padding-block: 0.5rem;
    @media (min-width: 700px) {
      padding-top: 0.25em;
      border-left: 1px solid var(--border-color);
      padding-left: 20px;
    }
  }
`;
