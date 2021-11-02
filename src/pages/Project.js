import { useLayoutEffect, useMemo, useState } from "react";
import styled from "styled-components";
import DotLoader from "react-spinners/DotLoader";
import {
  FormControl,
  VStack,
  Box,
  Icon,
  ListItem,
  UnorderedList,
  Badge,
  Flex,
  HStack,
  Heading,
  Text,
  FormLabel,
  Select,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";

import TaskDateRangeCalendar from "../components/TaskRangeCalendar";
import ShowError from "../components/ShowError.js";
import ClientTaskIcon from "../components/ClientTaskIcon.js";

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
      <Box bg="blue.50" as="header">
        <Box className="" maxW={900} p={6} mx="auto">
          <Heading as="h1" size="md" color="blue.700">
            Outthink Asana Client Dashboard
          </Heading>
          <Heading as="h2" fontWeight="300">
            {project?.name}
          </Heading>
        </Box>
      </Box>

      <Box
        className=""
        maxW={960}
        alignItems="center"
        p={6}
        mx="auto"
        justifyContent="space-between"
      >
        {project.current_status && (
          <>
            <Badge className="heading-label">Status</Badge>
            <h2>{project.current_status?.title}</h2>
          </>
        )}
      </Box>

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
          <HStack as="li" gap={10} alignItems="center">
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
      <Box mx="auto" maxW={960} className="">
        <UnorderedList
          border={`1px solid `}
          borderColor="gray.200"
          listStyleType="none"
        >
          {filteredDates
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

                    "&:nth-child(even)": {
                      background: "blue.50",
                    },
                  }}
                >
                  <TaskGroup date={date} tasks={filteredTasks[date]} />
                </ListItem>
              );
            })}
          <ListItem>
            {tasks[0] && <TaskGroup tasks={filteredTasks[0]} />}
          </ListItem>
        </UnorderedList>
      </Box>
    </Box>
  );
}

function TaskGroup({ tasks, date }) {
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
      <UnorderedList spacing={4} p={0} m={0} className="tasks" styleType="none">
        {tasks &&
          tasks.map((task) => {
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
                      height: "1em",
                      "@media (min-width: 762px)": {
                        position: "absolute",
                        right: "calc(100% + 8px)",
                        top: "4px",
                      },
                      "@media (max-width: 760px)": {
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        "&::after": {
                          content: "attr(title)",
                          fontWeight: "bold",
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
          })}
      </UnorderedList>
    </Flex>
  );
}

function DateRange({ task }) {
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
styled(Project)`
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

const Date_Groups = styled.ul`
  --border-color: #ddd;
  > li:nth-child(even) {
    background: #f8fbff;
  }
  list-style: none;
  border: 1px solid var(--border-color);
  margin: 0;
  padding: 0;

  .date-group {
    display: flex;
    border-bottom: 1px solid var(--border-color);
    padding: 20px;
    gap: 40px;
    @media (max-width: 762px) {
      flex-direction: column;
    }
  }

  li:last-of-type .date-group {
    border-bottom: none;
  }
  h3 {
    min-width: 200px;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: px;
    .dayofweek {
      font-size: 10px;
      font-weight: bold;
      color: #1e3a8a;
      width: auto;
      display: inline-block;
      border: 1px solid currentColor;
      padding: 3px 5px;
      border-radius: 6px;
    }
    .month {
      color: #444;
    }
    .day {
      font-size: 38px;
      font-weight: 300;
      color: #1e3a8a;
    }
  }
  .tasks {
    margin-inline: 0;
    width: 100%;
    padding-inline: 0;
    display: flex;
    flex-direction: column;
    gap: 24px;
    h4 {
      margin-block: 0;
    }
    p {
      font-size: 14px;
      margin-bottom: 0;
    }
  }
`;

const Task = styled.li`
  list-style: none;
  display: flex;
  width: 100%;
  gap: 8px;
  flex-direction: column;
  padding: 4px;
  border-radius: 6px;
  position: relative;
  > * {
    margin: 0;
  }
  ${({ clientTask }) => {}}
  .date-range {
    background: #aac0de33;
    font-size: 12px;
    text-transform: uppercase;
    font-weight: bold;
    padding: 2px 4px;
    border-radius: 6px;
    color: #1e3a8a;
    display: inline-block;
  }
`;

const DateRangeWrapper = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
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
const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ul {
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: flex-end;
    list-style: none;
  }
  li {
    display: flex;
    gap: 4px;
    font-weight: bold;
  }
  &.wrapper {
    padding-bottom: 0;
  }
  label {
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  select {
    padding-inline: 0.64rem;
    border-radius: 6px;
    padding-block: 0.5rem;
    font-size: 16px;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23333333' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem;
    -webkit-print-color-adjust: exact;
    color-adjust: exac;
    appearance: none;
  }
`;

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

function isClientTask(customFields) {
  const clientTaskField = customFields.find(
    (field) => field.name === CLIENT_TASK.name
  );
  if (!clientTaskField) return false;
  return (
    Boolean(clientTaskField.enum_value) &&
    clientTaskField.enum_value.gid === CLIENT_TASK.trueId
  ); //if the id of fields value matches the yes enum id
}
