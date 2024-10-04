import { config } from "dotenv";
import fetch from "node-fetch";

//LOADS the SECRETS
config();

const TOKEN = process.env.ASANA_TOKEN;
const BASEURL = `https://app.asana.com/api/1.0`;
const WORKSPACE_ID = process.env.WORKSPACE_ID;

export async function handler(event) {
	let resData = {};

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

	resData = {
		project: projectInfo,
		tasks: tasksByDate,
		dates: datesSorted,
	};

	//Project Brief
	if (projectInfo.project_brief?.gid) {
		console.log('brief id:', projectInfo.project_brief?.gid)
		const { data: projectBrief } = await fetch(
			`${getProjectBrief(projectInfo.project_brief.gid)}`,
			{
				headers: {
					Authorization: `Bearer ${TOKEN}`,
				},
			},
		)
			.then((res) => res.json())
			.catch((e) => console.log({ e }));

		resData.brief = {};
		resData.brief.title = projectBrief.title;
		resData.brief.html = formatMarkup(projectBrief.html_text);
	}

	//Project Updates
	if (projectInfo.gid) {
		const { data: projectUpdates } = await fetch(
			`${getProjectUpdates(projectInfo.gid)}`,
			{
				headers: {
					Authorization: `Bearer ${TOKEN}`,
				},
			},
		)
			.then((res) => res.json())
			.catch((e) => console.log({ e }));
		const formattedProjectUpdates = projectUpdates.map((update)=>({
			...update,
			html_text: formatMarkup(update.html_text)
		}))
		resData.updates = formattedProjectUpdates;
	}

	if (projectInfo.gid) {
		const { data: projectAttachments } = await fetch(
			`${getProjectAttachments(projectInfo.gid)}`,
			{
				headers: {
					Authorization: `Bearer ${TOKEN}`,
				},
			},
		)
			.then((res) => res.json())
			.catch((e) => console.log({ e }));

		resData.attachments = projectAttachments
	}

	//Project Milestones
	if (projectInfo.gid) {
		console.log("hererererere")
		const {data: projectMilestones } = await fetch(
			`${getProjectMilestones(projectInfo.gid)}`,
			{
				headers: {
					Authorization: `Bearer ${TOKEN}`,
				},
			},
		)
			.then((res) => res.json())
			.catch((e) => console.log({ e }));
		console.log("project milestones:", projectMilestones)
		resData.milestones = projectMilestones;
	}

	return {
		statusCode: 200,
		body: JSON.stringify(resData),
	};
}

const taskFields = `opt_fields=gid,start_on,assignee,assignee_status,created_at,completed,completed_at,custom_fields,dependents,dependencies,due_on,name,html_notes,num_subtasks,tags`;
const projectFields = `opt_fields=gid,name,created_at,current_status,project_brief,color`;
const briefFields = `opt_fields=title,html_text`;
const updateFields = `opt_fields=title,html_text,created_at,author.name,color`;
const attachmentFields = `opt_fields=name,view_url`;
const milestoneFields = `opt_fields=gid,completed,name`

function getProjectTasks(id) {
	return `${BASEURL}/projects/${id}/tasks?${taskFields}`;
}
function getProjectUpdates(id) {
	return `${BASEURL}/projects/${id}/project_statuses?${updateFields}`;
}
function getProjectInfo(id) {
	return `${BASEURL}/projects/${id}?${projectFields}`;
}
function getProjectBrief(id) {
	return `${BASEURL}/project_briefs/${id}?${briefFields}`;
}
function getProjectAttachments(id) {
	return `${BASEURL}/attachments/?${attachmentFields}&parent=${id}`;
}
function getProjectMilestones(id) {
	return `${BASEURL}/workspaces/${WORKSPACE_ID}/tasks/search?resource_subtype=milestone&projects.all=${id}&sort_by=modified_at&sort_ascending=true&${milestoneFields}`
}

function getValidTasks(allTasks) {
	return allTasks.filter((task) => {
		// only show uncompleted tasks
		if (task.completed) return false;

		// only show tasks that have the correct custom field `Visibility` value
		const customFields = task.custom_fields;
		const visibilityField = customFields.find(
			(field) => field.name === "Visiblity",
		);

		if (!visibilityField) return false;
		// console.log(visibilityField.enum_value);

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

function formatMarkup(html) {
	console.log(html)
	html = html.trim().replace(/\n\n+/g, '\n\n').split(/\n\s*\n/).map(paragraph => {
    return `<p>${paragraph.trim().replace(/\n/g, '<br />')}</p>`;
  }).join('\n\n');
	return html;
}
