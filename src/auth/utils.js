const api = "https://otg-asana-client-dash.netlify.app/.netlify/identity";

export async function getUser(token) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const data = await fetch(`${api}/user`, requestOptions)
    .then((response) => response.json())
    .catch((error) => console.log("error", error));

  return data;
}

export async function login(username, password) {
  const data = await fetch(
    `${api}/token?grant_type=password&username=${username}&password=${password}`,
    {
      method: "POST",
    }
  )
    .then((res) => res.json())
    .catch(console.error);

  const { access_token } = data;
  const userData = await getUser(access_token);

  const identity = {
    ...data,
    user: userData,
  };

  localStorage.setItem("identity", JSON.stringify(identity));
  return identity.user;
}
