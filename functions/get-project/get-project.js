import { config } from "dotenv";
import { appConfig } from "./app-config.json";
import fetch from "node-fetch";
config();
const TOKEN = process.env.ASANA_TOKEN;
const BASEURL = `https://app.asana.com/api/1.0`;

export async function handler(event) {
  // your server-side functionaliuity
  const projId = event.queryStringParameters.project;
  const { data } = await fetch(`${getAsanaProj(projId)}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  }).then((res) => res.json());

  const publicTasks = getPublicTasks(data);
  const tasksByDate = groupByDate(publicTasks);
  const datesSorted = getDatesAndSort(tasksByDate);
  return {
    statusCode: 200,
    body: JSON.stringify({ tasksByDate, datesSorted }),
  };
}

const fields = `opt_fields=gid,assignee,assignee_status,created_at,completed,completed_at,custom_fields,dependents,dependencies,due_on,name,notes,num_subtasks,tags`;

function getAsanaProj(id) {
  return `${BASEURL}/projects/${id}/tasks?${fields}`;
}
function getPublicTasks(allTasks) {
  return allTasks.filter((task) =>
    task.tags.some((tag) => tag.gid === String(appConfig.publicTag))
  );
}
function groupByDate(taskArray) {
  return taskArray.reduce((acc, task) => {
    const { due_on } = task;
    const dueDate = due_on == null ? 0 : due_on;
    if (!acc[dueDate]) {
      acc[dueDate] = [];
    }
    acc[dueDate].push(task);
    return acc;
  }, {});
}
function getDatesAndSort(tasksByDate) {
  return Object.keys(tasksByDate)
    .filter((key) => key !== "0")
    .sort((a, b) => (a >= b ? 1 : -1));
}
