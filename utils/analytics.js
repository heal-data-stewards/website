export function sendCustomEvent(eventName, params = {}) {
  // Only run in browser + only if gtag is ready
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  
 console.log("Sending custom event:", eventName, params);

  // window.gtag("event", eventName, params);
}
