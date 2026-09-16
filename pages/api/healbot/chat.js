const HEALBOT_API_URL = process.env.HEALBOT_API_URL || "http://localhost:8000"
const HEALBOT_API_USER = process.env.HEALBOT_API_USER || "healbot"
const HEALBOT_API_PASSWORD = process.env.HEALBOT_API_PASSWORD || ""

// The upstream chain only reads the last 6 turns; sending more just inflates
// the request.
const HISTORY_LIMIT = 6
const REQUEST_TIMEOUT_MS = 60000

const UNAVAILABLE = "The assistant is unavailable right now. Please try again."

// Proxying keeps these credentials on the server; they must never reach the
// browser bundle.
const authorization = () =>
  "Basic " +
  Buffer.from(`${HEALBOT_API_USER}:${HEALBOT_API_PASSWORD}`).toString("base64")

const chat = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { message, history } = req.body || {}

  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ message: "A message is required." })
  }

  const sanitizedHistory = (Array.isArray(history) ? history : [])
    .filter(
      (entry) =>
        entry &&
        (entry.role === "user" || entry.role === "assistant") &&
        typeof entry.content === "string"
    )
    .slice(-HISTORY_LIMIT)
    .map(({ role, content }) => ({ role, content }))

  try {
    const response = await fetch(`${HEALBOT_API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization(),
      },
      body: JSON.stringify({ message, history: sanitizedHistory }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })

    if (response.status === 401) {
      console.error(
        "healbot rejected the credentials — check HEALBOT_API_USER and HEALBOT_API_PASSWORD"
      )
      return res.status(502).json({ message: UNAVAILABLE })
    }

    if (!response.ok) {
      console.error(`healbot responded with ${response.status}`)
      return res.status(502).json({ message: UNAVAILABLE })
    }

    const { reply } = await response.json()

    if (typeof reply !== "string") {
      console.error("healbot returned a response without a reply")
      return res.status(502).json({ message: UNAVAILABLE })
    }

    return res.status(200).json({ reply })
  } catch (error) {
    console.error(`healbot request failed: ${error.message}`)
    return res.status(502).json({ message: UNAVAILABLE })
  }
}

export default chat
