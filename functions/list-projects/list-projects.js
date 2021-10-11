import { config } from "dotenv";
import fetch from "node-fetch";

config();

const TOKEN = process.env.ASANA_TOKEN;
const BASEURL = `https://app.asana.com/api/1.0`;

export async function handler(event) {
  const projId = event.queryStringParameters.project;
  //Tasks
  const { data: projects } = await fetch(`${getProjects(projId)}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  }).then((res) => res.json());

  console.log(projects);
  return {
    statusCode: 200,
    body: JSON.stringify(projects.filter((p) => !p.archived)),
  };
}

function getProjects() {
  return `${BASEURL}/projects/?opt_fields=archived,name,created_at,current_status&workspace=23156169120585`;
}
