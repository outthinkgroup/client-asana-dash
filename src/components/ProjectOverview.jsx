import { useLayoutEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

function ProjectOverview({ brief, className }) {
	console.log({ brief });
	return (
		<div className={className}>
			<div className="tabs-wrapper">
				<Tabs>
					<TabList>
						<Tab>Project Updates</Tab>
						<Tab>Project Brief</Tab>
					</TabList>

					<TabPanel>
						<section>
							<h3>Project Updates</h3>
						</section>
					</TabPanel>
					<TabPanel>
						<section className="brief-wrapper">
							<div dangerouslySetInnerHTML={{ __html: brief?.html }} />
						</section>
					</TabPanel>
				</Tabs>
			</div>
		</div>
	);
}

export default styled(ProjectOverview)`
  .react-tabs__tab-list {
    margin-bottom: 0px;
  }
  display: flex;
  .tabs-wrapper {
    flex: 1;
  }

  .brief-wrapper {
    padding-top: 40px;
    padding: 20px;
    border: 1px solid #aaa;
    border-top: 0;
    font-size: 15px;
    a {
      color: #203D8B;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      color: #2b2c2e;
      line-height: 1.2;
    }
    h1 {
      margin-top: 0;
      font-size: 28px;
      font-weight: 400;
    }
    h1:not(:first-of-type) {
      margin-top: 0.5em;
      font-size: 24px;
      font-weight: 800;
    }
    h2 {
      font-size: 20px;
    }
    line-height: 1.4;
  }
`;
