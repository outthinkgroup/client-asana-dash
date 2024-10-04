import { useLayoutEffect, useMemo, useState } from "react";
import styled from "styled-components";
import DotLoader from "react-spinners/DotLoader";

import TaskDateRangeCalendar from "../../components/TaskRangeCalendar";
import {getMonth, parseDateString, getDay} from  "../../dateUtils.js"

import ClientTaskIcon from "../../components/ClientTaskIcon.jsx";

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
export default function Timeline({ tasks }) {
	const [filter, setFilter] = useState("all");
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


	return (
		<>
			<TopBar className=" wrapper">
				<div className="filters">
					<label>
						<span>Show</span>
						<select onChange={(e) => setFilter(e.target.value)} value={filter}>
							{Object.keys(filterFunctions).map((filterName) => (
								<option key={filterName} value={filterName}>
									{filterName} tasks
								</option>
							))}
						</select>
					</label>
				</div>
				<ul className="key">
					<li>
						<ClientTaskIcon
							color="#FF8F69"
							className="special-identifier-icon"
						/>
						Client Task
					</li>
				</ul>
			</TopBar>

			<div className="wrapper">
				<DateGroups>
					{filteredDates
						.filter((a) => {
							// Bugs out without
							return a !== "0";
						})
						.sort()
						.map((date) => {
							return (
								<li key={date}>
									<TaskGroup date={date} tasks={filteredTasks[date]} />
								</li>
							);
						})}
					<li>{tasks[0] && <TaskGroup tasks={filteredTasks[0]} />}</li>
				</DateGroups>
			</div>
		</>
	);
}

function TaskGroup({ tasks, date }) {
	const month = date ? getMonth(date) : null;
	const { day, dayOfWeek } = date ? getDay(date) : {};
	return (
		<div className="date-group">
			<h3>
				{typeof date == "string" ? (
					<>
						<span>
							<div className="dayofweek">{dayOfWeek}</div>
						</span>
						<div className="day">{day}</div>
						<span className="month">{month}</span>
					</>
				) : (
					"No Date Given"
				)}
			</h3>
			<ul className="tasks">
				{tasks &&
					tasks.map((task) => {
						return (
							<Task
								key={task.gid}
								clientTask={isClientTask(task.custom_fields)}
							>
								{isClientTask(task.custom_fields) ? (
									<ClientTaskIcon
										title="Client Task"
										className="special-identifier-icon "
										color={`#FF8F69`}
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
							</Task>
						);
					})}
			</ul>
		</div>
	);
}

function DateRange({ task }) {
	return task.start_on && task.due_on ? (
		<DateRangeWrapper>
			<div>
				<div className="date-range">
					<span>
						{getMonth(task.start_on, false)} {getDay(task.start_on).day}
					</span>{" "}
					-
					<span>
						{" "}
						{getMonth(task.due_on, false)} {getDay(task.due_on).day}
					</span>
				</div>
			</div>

			<TaskDateRangeCalendar
				startOn={new Date(...parseDateString(task.start_on))}
				dueOn={new Date(...parseDateString(task.due_on))}
			/>
		</DateRangeWrapper>
	) : null;
}

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
const DateGroups = styled.ul`
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
  ${({ clientTask }) => { }}
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
function isClientTask(customFields) {
	const clientTaskField = customFields.find(
		(field) => field.name === CLIENT_TASK.name,
	);
	if (!clientTaskField) return false;
	return (
		Boolean(clientTaskField.enum_value) &&
		clientTaskField.enum_value.gid === CLIENT_TASK.trueId
	); //if the id of fields value matches the yes enum id
}
