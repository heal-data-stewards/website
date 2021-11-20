import axios from "axios";

function getEvents(token) {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://graph.microsoft.com/v1.0/users/${process.env.USER_ID}/calendar/events`,
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

function getEvent(token,id) {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://graph.microsoft.com/v1.0/users/${process.env.USER_ID}/calendar/events/${id}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        console.log("twhat")
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
      `https://login.microsoftonline.com/${process.env.MSFT_TENANT}/oauth2/v2.0/token`,
      params,
      headers
    )
    .then((res) => {
      return res.data.access_token;
    })
    .catch((error) => {
      return error;
    });

    if (id === undefined) {
      event = await getEvents(token);
    } else {
      event = await getEvent(token, id);
      // console.log(event)
    }

  return event;
}


export async function getPageData2(id, preview = false) {
  // Find the pages that match this slug
  // const pagesData = await fetchAPI(
  //   `/articles?slug=${slug}&status=published${preview ? "&status=draft" : ''}`
  // );

  const eventData = await getAuthorizationToken(id)
 
  // Make sure we found something, otherwise return null
  if (eventData == null) {
    return null;
  }
 
  // Return the first item since there should only be one result per slug
  return eventData;
 }