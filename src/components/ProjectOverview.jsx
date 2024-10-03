import { useLayoutEffect, useMemo, useState } from "react";

import styled from "styled-components";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

function ProjectOverview({ brief, className, updates }) {
  const [isShowingAllUpdates, setIsShowingAllUpdates] = useState(false);
  const [firstUpdate, ...restOfUpdates] = updates;

  return (
    <div className={className}>
      <div className="tabs-wrapper">
        <Tabs>
          <TabList>
            <Tab>Project Updates</Tab>
            <Tab>Project Brief</Tab>
          </TabList>

          <TabPanel>
            <section className="tab-pannel-wrapper project-updates-wrapper">
              <h3>Project Updates</h3>
              {firstUpdate ? (
                <article>
                  <h4>{firstUpdate.title ?? ``}</h4>
                  <div style={{ fontSize: "10px" }}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: firstUpdate?.html_text,
                      }}
                    />
                  </div>
                </article>
              ) : (
                <p>No Project Updates Yet...</p>
              )}

              {isShowingAllUpdates ? (
                <div className="rest-of-updates-wrapper">
                  <div className="list">
                    {restOfUpdates?.map((update, i) => (
                      <>
                        <button
                          className="toggle-button "
                          style={{
                            position: `absolute`,
                            right: `.25em`,
                            top: `.25em`,
														padding:`.5em`,
                          }}
                          onClick={() => setIsShowingAllUpdates(false)}
                        >
                          Hide Past Updates
                        </button>
                        <article key={i}>
                          <h4>{update.title ?? `Project Update #${i}`}</h4>
                          <div style={{ fontSize: "10px" }}>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: update?.html_text,
                              }}
                            ></div>
                          </div>
                        </article>
                      </>
                    ))}
                  </div>
                </div>
              ) : (
                <button
                  className="toggle-button"
                  onClick={() => setIsShowingAllUpdates((state) => !state)}
                >
                  Show All Past Updates
                </button>
              )}
            </section>
          </TabPanel>
          <TabPanel>
            <section className="brief-wrapper tab-pannel-wrapper">
              <div dangerouslySetInnerHTML={{ __html: brief?.html }} />
            </section>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
}

export default styled(ProjectOverview)`
  display: flex;

  .react-tabs__tab-list {
    margin-bottom: 0px;
  }

  .react-tabs__tab {
    color: #777;
    font-weight: bold;
  }
  .react-tabs__tab--selected {
    color: #000;
  }

  .react-tabs__tab-panel {
    position: relative;
    z-index: 2;
  }

  .tabs-wrapper {
    flex: 1;
  }

  .tab-pannel-wrapper {
    padding-top: 40px;
    padding: 20px;
    border: 1px solid #aaa;
    border-top: 0;
    font-size: 15px;
    line-height: 1.4;

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      color: #2b2c2e;
      line-height: 1.2;
      &:first-of-type {
        margin-top: 0px;
      }
    }

    a {
      color: #203d8b;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }

    h2 {
      font-size: 20px;
    }
  }

  .toggle-button {
    background: #eff6ff;
    color: #1e3a8a;
    font-size: 13px;
    padding: 1em;
    font-weight: bold;
    border: 1px solid currentColor;
    border-radius: 6px;

    &:hover {
      background: #1e3a8a;
      color: #eff6ff;
    }
  }

  .project-updates-wrapper {
    article :is(h1, h2, h3, h4, h5) {
      margin-block: 0.5em;
    }
  }

  .project-updates-wrapper .list {
		border-top: 1px solid #1e3a8a;
;

    position: relative;
    article {
      padding: 20px;
    }
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .brief-wrapper {
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
  }
`;
