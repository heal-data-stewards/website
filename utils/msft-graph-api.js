import axios from "axios";

function getEvents(token) {
  console.log(token);
  axios
    .get(`https://graph.microsoft.com/v1.0/users`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((res) => {
      console.log(res.data);
    })
    .catch((error) => {
      console.log(error.response.data);
    });
}

export function getAuthorizationToken() {
  const params = new URLSearchParams();
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  params.append("client_id", process.env.CLIENT_ID);
  params.append("scope", process.env.SCOPE);
  params.append("client_secret", process.env.CLIENT_SECRET);
  params.append("grant_type", process.env.GRANT_TYPE);

  axios
    .post(
      `https://login.microsoftonline.com/${process.env.MSFT_TENANT}/oauth2/v2.0/token`,
      params,
      headers
    )
    .then((res) => {
      getEvents(res.data.access_token);
    })
    .catch((error) => {
      console.log(error);
    });
}
