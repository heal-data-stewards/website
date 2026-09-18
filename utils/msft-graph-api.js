import axios from "axios"

const TOKEN_URL =
  "https://login.microsoftonline.com/58b3d54f-16c9-42d3-af08-1fcabd095666/oauth2/v2.0/token"

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function axiosWithBackoff(config, retries = 5, baseDelay = 1000) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await axios(config)
      return res
    } catch (error) {
      const status = error.response?.status
      const errorCode = error.response?.data?.error?.code

      const isThrottled =
        status === 429 ||
        status === 503 ||
        errorCode === "ApplicationThrottled" ||
        errorCode === "ServiceUnavailable"

      if (!isThrottled || attempt === retries) {
        throw error.response?.data ?? error
      }

      // Respect Retry-After header if present, otherwise exponential backoff
      const retryAfter = error.response?.headers?.["retry-after"]
      const delay = retryAfter
        ? parseInt(retryAfter, 10) * 1000
        : baseDelay * 2 ** attempt

      console.warn(
        `Graph API throttled (${
          errorCode ?? status
        }). Retrying in ${delay}ms... (attempt ${attempt + 1}/${retries})`
      )
      await sleep(delay)
    }
  }
}

// When ALLOW_BUILD_WITHOUT_CALENDAR is true, a missing or expired Microsoft
// Graph credential no longer fails the build: the calendar-driven sections
// render a "calendar unavailable" notice instead. With working credentials the
// flag has no effect at all - the calendar is fetched and rendered as usual.
export function buildWithoutCalendarAllowed() {
  const flag = String(process.env.ALLOW_BUILD_WITHOUT_CALENDAR ?? "")
    .trim()
    .toLowerCase()
  return flag === "true" || flag === "1"
}

// Graph errors arrive as the raw { error: { code, message } } body thrown by
// axiosWithBackoff, token errors as a real Error. Flatten both to one line.
function describeError(error) {
  if (!error) {
    return "Unknown calendar error"
  }
  if (typeof error === "string") {
    return error
  }
  if (error.error?.message) {
    return `${error.error.code}: ${error.error.message.split("\n")[0]}`
  }
  return error.message ?? JSON.stringify(error)
}

// Build-time stand-ins for the shapes getAuthorizationToken normally returns.
// The extra properties mirror the existing `events.token` convention: they are
// read in getStaticProps and never survive serialization to the client.
function unavailableEvents(reason) {
  const events = []
  events.token = null
  events.calendarUnavailable = true
  events.calendarUnavailableReason = reason
  return events
}

function unavailableEvent(reason) {
  return {
    token: null,
    calendarUnavailable: true,
    calendarUnavailableReason: reason,
  }
}

function handleCalendarFailure(error, id) {
  const reason = describeError(error)

  if (!buildWithoutCalendarAllowed()) {
    throw error instanceof Error ? error : new Error(reason)
  }

  console.warn(
    `[calendar] ${reason}\n` +
      "[calendar] ALLOW_BUILD_WITHOUT_CALENDAR is set - building without calendar data."
  )

  return id === undefined ? unavailableEvents(reason) : unavailableEvent(reason)
}

export function getEvents(token) {
  return new Promise((resolve, reject) => {
    axiosWithBackoff({
      method: "get",
      url: `https://graph.microsoft.com/v1.0/users/RENCI_healdataca.rmb@ad.unc.edu/calendar/events?$top=100`,
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => resolve(res.data.value))
      .catch(reject)
  })
}

export function getEvent(token, id) {
  return new Promise((resolve, reject) => {
    axiosWithBackoff({
      method: "get",
      url: `https://graph.microsoft.com/v1.0/users/RENCI_healdataca.rmb@ad.unc.edu/calendar/events/${id}`,
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => resolve(res.data))
      .catch(reject)
  })
}

// A failed client-credentials request still returns JSON with a 401, so the
// response has to be inspected - fetch only rejects on network errors. Without
// this check an undefined token reaches Graph as "Bearer undefined" and comes
// back as a confusing "JWT is not well formed" error.
async function requestAccessToken() {
  const data = {
    client_id: process.env.CLIENT_ID,
    scope: process.env.SCOPE,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: process.env.GRANT_TYPE,
  }

  const missing = Object.keys(data).filter((key) => !data[key])
  if (missing.length !== 0) {
    throw new Error(
      `Missing Microsoft Graph credentials: ${missing.join(", ")}`
    )
  }

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(data),
  })

  const body = await response.json().catch(() => ({}))

  if (!body.access_token) {
    const detail = body.error_description
      ? body.error_description.split("\n")[0]
      : `${response.status} ${response.statusText}`
    throw new Error(`Microsoft Graph token request failed: ${detail}`)
  }

  return body.access_token
}

export async function getAuthorizationToken(id) {
  let token
  try {
    token = await requestAccessToken()
  } catch (error) {
    return handleCalendarFailure(error, id)
  }

  let event
  try {
    event =
      id === undefined ? await getEvents(token) : await getEvent(token, id)
  } catch (error) {
    return handleCalendarFailure(error, id)
  }

  event.token = token
  return event
}

export async function fetchEvents(token) {
  // The calendar was unavailable at build time, so there is no token to refresh
  // the listing with on the client.
  if (!token) {
    return []
  }
  let event = await getEvents(token)
  return event
}
