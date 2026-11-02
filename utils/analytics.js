export function sendCustomEvent(eventName, params = {}) {
  if (typeof window === "undefined") {
    return
  }

  console.log("[analytics]", eventName, params)

  // Only send to GA if gtag is ready
  if (typeof window.gtag !== "function") {
    console.warn("[analytics] gtag unavailable, event not sent", eventName)
    return
  }

  window.gtag("event", eventName, params)
}
