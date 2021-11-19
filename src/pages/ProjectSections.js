import { useLayoutEffect, useMemo, useState } from "react";
import DotLoader from "react-spinners/DotLoader";

import { Flex, HStack, Text, Box, Icon } from "@chakra-ui/react";

// import { Badge } from "../elements";
import ShowError from "../components/ShowError.js";
import ClientTaskIcon from "../components/ClientTaskIcon.js";
import ProjectHeader from "../components/ProjectHeader.js";
import { TasksByDate, LoaderFrame } from "./Project.js";

// Used for filtering the task list by a custom field value

function ProjectSections({ className }) {
  const [projectData, setProjectData] = useState(null);
  const [appError, setAppError] = useState(false);

  useLayoutEffect(() => {
    const params = new URLSearchParams(window.location.search);
    getData(params)
      .then(setProjectData)
      .catch((e) => {
        setAppError(e.toString());
      });
  }, []);

  const { project, tasks } = projectData ? projectData : {};

  // THIS WILL CHANGE TO SECTIONS NOT DATES
  const [filteredDates, filteredTasks] = useMemo(() => {
    if (!tasks) return [];
    const tasksByDate = Object.keys(tasks).reduce((tasksObj, date) => {
      const filteredTasks = tasks[date].filter(() => true);
      if (filteredTasks.length) {
        tasksObj[date] = filteredTasks;
      }
      return tasksObj;
    }, {});

    const dates = Object.keys(tasksByDate);

    return [dates, tasksByDate];
  }, [tasks]);

  if (!filteredTasks) {
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
    <Box className={`App ${className}`}>
      <ProjectHeader project={project} />

      <Flex
        className=""
        maxW={960}
        alignItems="center"
        p={6}
        mx="auto"
        justifyContent="space-between"
      >
        {/*
<Flex className="filters">
<HStack as={FormLabel} alignItems="center" spacing={4} m={0}>
<span>Show</span>
<Select onChange={(e) => setFilter(e.target.value)} value={filter}>
{Object.keys(filterFunctions).map((filterName) => (
<option key={filterName} value={filterName}>
{filterName} tasks
</option>
))}
</Select>
</HStack>
</Flex>
      */}

        <ul className="key">
          <HStack as="li" spacing={10} alignItems="center">
            <Icon
              as={ClientTaskIcon}
              color="orange.300"
              className="special-identifier-icon"
            />
            <Text>Client Task</Text>
          </HStack>
        </ul>
      </Flex>

      {/*main loop of all the tasks*/}
      <TasksByDate dates={filteredDates} tasks={tasks && filteredTasks} />
    </Box>
  );
}

export default ProjectSections;

async function getData(query) {
  if (query && query.has("id") && query.get("id")) {
    const projId = query.get("id");
    return fetch(
      `${window.location.origin}/api/get-project?project=${projId}`
    ).then((res) => res.json());
  } else {
    throw new Error("No Project found");
  }
}
