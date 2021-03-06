import { config } from "dotenv";
import fetch from "node-fetch";

//LOADS the SECRETS
config();

const TOKEN = process.env.ASANA_TOKEN;
const BASEURL = `https://app.asana.com/api/1.0`;

export async function handler(event) {
  const projId = event.queryStringParameters.project;
  //Tasks
  const { data: taskData } = await fetch(`${getProjectTasks(projId)}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  }).then((res) => res.json());

  //Project Name
  const { data: projectInfo } = await fetch(`${getProjectInfo(projId)}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  }).then((res) => res.json());

  const publicTasks = getValidTasks(taskData);
  const tasksByDate = groupByDate(publicTasks);
  const datesSorted = getDatesAndSort(tasksByDate);

  return {
    statusCode: 200,
    body: JSON.stringify({
      project: projectInfo,
      tasks: tasksByDate,
      dates: datesSorted,
    }),
  };
}

const taskFields = `opt_fields=gid,start_on,assignee,assignee_status,created_at,completed,completed_at,custom_fields,dependents,dependencies,due_on,name,html_notes,num_subtasks,tags`;
const projectFields = `opt_fields=gid,name,created_at,current_status`;

function getProjectTasks(id) {
  return `${BASEURL}/projects/${id}/tasks?${taskFields}`;
}
function getProjectInfo(id) {
  return `${BASEURL}/projects/${id}?${projectFields}`;
}

function getValidTasks(allTasks) {
  return allTasks.filter((task) => {
    // only show uncompleted tasks
    if (task.completed) return false;

    // only show tasks that have the correct custom field `Visibility` value
    const customFields = task.custom_fields;
    const visibilityField = customFields.find(
      (field) => field.name === "Visiblity"
    );

    if (!visibilityField) return false;
    console.log(visibilityField.enum_value);

    return visibilityField?.enum_value?.gid === "1200954383416360"; // will only show if the enum_value has the id that is the Visible to Client gid
  });
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
