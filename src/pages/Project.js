import { useLayoutEffect, useMemo, useState } from "react";
import styled from "styled-components";
import DotLoader from "react-spinners/DotLoader";

import {
  VStack,
  Box,
  Icon,
  ListItem,
  UnorderedList,
  Flex,
  HStack,
  Heading,
  Text,
  FormLabel,
  Badge,
  Select,
} from "@chakra-ui/react";

// import { Badge } from "../elements";
import TaskDateRangeCalendar from "../components/TaskRangeCalendar";
import ShowError from "../components/ShowError.js";
import ClientTaskIcon from "../components/ClientTaskIcon.js";
import ProjectHeader from "../components/ProjectHeader.js";

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
  const [projectData, setProjectData] = useState(null);
  const [appError, setAppError] = useState(false);

  const [filter, setFilter] = useState("all");

  useLayoutEffect(() => {
    const params = new URLSearchParams(window.location.search);
    getData(params)
      .then(setProjectData)
      .catch((e) => {
        setAppError(e.toString());
      });
  }, []);

  const { project, tasks } = projectData ? projectData : {};

  // filter tasks and dates based on the filter state
  const [filteredDates, filteredTasks] = useMemo(() => {
    if (!tasks) return [];
    const tasksByDate = Object.keys(tasks).reduce((tasksObj, date) => {
      const filteredTasks = tasks[date].filter(filterFunctions[filter]);
      if (filteredTasks.length) {
        tasksObj[date] = filteredTasks;
      }
      return tasksObj;
    }, {});

    const dates = Object.keys(tasksByDate);

    return [dates, tasksByDate];
  }, [tasks, filter]);

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

export function TasksByDate({ dates, tasks }) {
  return (
    <Box mx="auto" maxW={960} className="">
      <UnorderedList
        border={`1px solid `}
        borderColor="gray.200"
        listStyleType="none"
      >
        {dates
          .filter((a) => {
            // Bugs out without
            return a !== "0";
          })
          .sort()
          .map((date) => {
            return (
              <ListItem
                key={date}
                borderBottom={`1px solid `}
                borderColor="gray.200"
                sx={{
                  "&:last-child": {
                    border: "none",
                  },

                  "&:nth-of-type(even)": {
                    background: "blue.50",
                  },
                }}
              >
                <TaskDateGroup date={date} tasks={tasks ? tasks[date] : []} />
              </ListItem>
            );
          })}
        <ListItem>
          <TaskDateGroup tasks={tasks && tasks[0]} />
        </ListItem>
      </UnorderedList>
    </Box>
  );
}

function TaskDateGroup({ tasks, date }) {
  const month = date ? getMonth(date) : null;
  const { day, dayOfWeek } = date ? getDay(date) : {};
  return (
    <Flex
      p={4}
      sx={{ gap: "40px" }}
      flexDirection={{ base: "column", md: "row" }}
      className="date-group"
    >
      <VStack align="start">
        {typeof date == "string" ? (
          <>
            <Box minW={200}>
              <Badge variant="outline" className="dayofweek" fontSize="xs">
                {dayOfWeek}
              </Badge>
            </Box>
            <Heading as="h3" fontWeight="300" color="blue.700" className="day">
              {day}
            </Heading>
            <Box className="month" color="gray.600">
              {month}
            </Box>
          </>
        ) : (
          "No Date Given"
        )}
      </VStack>
      <UnorderedList
        spacing={[10, 4, 4]}
        p={0}
        m={0}
        className="tasks"
        styleType="none"
      >
        {tasks &&
          tasks.map((task, i) => {
            return <Task task={task} key={i} />;
          })}
      </UnorderedList>
    </Flex>
  );
}

export function Task({ task }) {
  return (
    <ListItem
      key={task.gid}
      clientTask={isClientTask(task.custom_fields)}
      position="relative"
    >
      {isClientTask(task.custom_fields) ? (
        <Icon
          color="orange.300"
          className="special-identifier-icon"
          as={ClientTaskIcon}
          title="Client Task"
          sx={{
            "@media (min-width: 48em)": {
              position: "absolute",
              right: "calc(100% + 8px)",
              top: "4px",
            },
            "@media (max-width: 48em)": {
              display: "flex",
              alignItems: "center",
              gap: "4px",
              "& svg": {
                minWidth: "1em",
              },
              "&::after": {
                content: "attr(title)",
                fontWeight: "bold",
                display: "block",
                whiteSpace: "nowrap",
              },
            },
          }}
        />
      ) : null}
      <h4>{task.name}</h4>
      <DateRange task={task} />
      {task.html_notes && (
        <p
          dangerouslySetInnerHTML={{
            __html: task.html_notes.replace("\n", "</br>"),
          }}
        />
      )}
    </ListItem>
  );
}

export function DateRange({ task }) {
  return task.start_on && task.due_on ? (
    <HStack spacing={2} alignItems="center">
      <div>
        <Badge className="date-range">
          <span>
            {getMonth(task.start_on, false)} {getDay(task.start_on).day}
          </span>{" "}
          -
          <span>
            {" "}
            {getMonth(task.due_on, false)} {getDay(task.due_on).day}
          </span>
        </Badge>
      </div>

      <TaskDateRangeCalendar
        startOn={new Date(...parseDateString(task.start_on))}
        dueOn={new Date(...parseDateString(task.due_on))}
      />
    </HStack>
  ) : null;
}

export default Project;

export const LoaderFrame = styled.div`
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  background: #eff6ff;
  height: 100vh;
  display: grid;
  place-items: center;
`;

async function getData(query, options) {
  if (query && query.has("id") && query.get("id")) {
    const projId = query.get("id");
    return fetch(
      `${window.location.origin}/api/get-project?project=${projId}`
    ).then((res) => res.json());
  } else {
    throw new Error("No Project found");
  }
}

export function getMonth(dateString, isLong = true) {
  const dateArr = parseDateString(dateString);
  const date = new Date(...dateArr); // 2009-11-10
  const month = date.toLocaleString("default", {
    month: isLong ? "long" : "short",
  });
  return month;
}

export function getDay(dateString, isLong = true) {
  const dateArr = parseDateString(dateString);
  const date = new Date(...dateArr);
  const day = date.getDate();
  const dayOfWeek = date.toLocaleString("default", {
    weekday: isLong ? "long" : "short",
  });
  return { day, dayOfWeek };
}

export function parseDateString(dateString) {
  const [year, day, month] = dateString.split("-");
  return [Number(year), Number(day) - 1, Number(month)];
}

export function isClientTask(customFields) {
  const clientTaskField = customFields.find(
    (field) => field.name === CLIENT_TASK.name
  );
  if (!clientTaskField) return false;
  return (
    Boolean(clientTaskField.enum_value) &&
    clientTaskField.enum_value.gid === CLIENT_TASK.trueId
  ); //if the id of fields value matches the yes enum id
}
