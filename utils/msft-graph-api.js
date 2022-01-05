import axios from "axios";

export function getEvents(token) {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://graph.microsoft.com/v1.0/users/RENCI_healdataca.rmb@ad.unc.edu/calendar/events`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => {
        resolve(res.data.value);
      })
      .catch((error) => {
        reject(error.response.data);
      });
  });
}

export function getEvent(token,id) {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://graph.microsoft.com/v1.0/users/RENCI_healdataca.rmb@ad.unc.edu/calendar/events/${id}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => {
        // console.log(res)
        resolve(res.data);
      })
      .catch((error) => {
        reject(error.response.data);
      });
  });
}

export async function getAuthorizationToken(id) {
  const params = new URLSearchParams();
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  let event = "";
  params.append("client_id", process.env.CLIENT_ID);
  params.append("scope", process.env.SCOPE);
  params.append("client_secret", process.env.CLIENT_SECRET);
  params.append("grant_type", process.env.GRANT_TYPE);
  
  const token = await axios
    .post(
      `https://login.microsoftonline.com/58b3d54f-16c9-42d3-af08-1fcabd095666/oauth2/v2.0/token`,
      params,
      headers
    )
    .then((res) => {
      // console.log(res)
      return res.data.access_token;
    })
    .catch((error) => {
      // console.log("res1 ERROR")
      return error;
    });

    if (id === undefined) {
      event = await getEvents(token);
    } else {
      event = await getEvent(token, id);
    }
    event.token = token
  return event;
}

export async function getAuthorizationToken2(id) {
  const params = new URLSearchParams();
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  let event = "";
  params.append("client_id", process.env.CLIENT_ID);
  params.append("scope", process.env.SCOPE);
  params.append("client_secret", process.env.CLIENT_SECRET);
  params.append("grant_type", process.env.GRANT_TYPE);
  
  const token = await axios
    .post(
      `https://login.microsoftonline.com/58b3d54f-16c9-42d3-af08-1fcabd095666/oauth2/v2.0/token`,
      params,
      headers
    )
    .then((res) => {
      // console.log(res)
      return res.data.access_token;
    })
    .catch((error) => {
      // console.log("res1 ERROR")
      return error;
    });

    
      event = await getEvents(id);
  return event;
}