import fetch from "node-fetch";
import { config } from "dotenv";
config();

const TOKEN = process.env.ASANA_TOKEN;
const ADMIN_ID = process.env.ADMIN_ID;
const BASEURL = `https://app.asana.com/api/1.0`;

export async function handler(event) {
  const { projId, newStatus, userId } = JSON.parse(event.body);

  if (userId !== ADMIN_ID) {
    return {
      statusCode: 401,
      body: "Not Authorized",
    };
  }

  //Update the project in api
  const { data: projectStatusInfo } = await fetch(
    `${updateProjectURL(projId)}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        data: { ...newStatus, color: "green" },
      }),
    }
  )
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .catch(console.error);

  return {
    statusCode: 200,
    body: JSON.stringify(projectStatusInfo),
  };
}

function updateProjectURL(id) {
  return `${BASEURL}/projects/${id}/project_statuses`;
}
