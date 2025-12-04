export function sendCustomEvent(eventName, params = {}) {
  // Only run in browser + only if gtag is ready
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", eventName, params);
}
