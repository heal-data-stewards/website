import axios from "axios";

export function getEvents(token) {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://graph.microsoft.com/v1.0/users/RENCI_healdataca.rmb@ad.unc.edu/calendar/events?$top=50`,
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

export function getEvent(token, id) {
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
  let event = "";

  const data = {
    client_id: process.env.CLIENT_ID,
    scope: process.env.SCOPE,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: process.env.GRANT_TYPE,
  };

  let token = await fetch(
    "https://login.microsoftonline.com/58b3d54f-16c9-42d3-af08-1fcabd095666/oauth2/v2.0/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(data),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      return data.access_token;
    })
    .catch((error) => {
      console.error(error);
    });

  if (id === undefined) {
    event = await getEvents(token);
  } else {
    event = await getEvent(token, id);
  }
  event.token = token;
  return event;
}

export async function fetchEvents(token) {
  let event = await getEvents(token);
  return event;
}
