export const trackEvent = (eventName, params = {}) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, {
      ...params,
    });
    console.log(`Event Tracked: ${eventName}`, params); // Optional: Debug log
  } else {
    console.warn("Google Analytics is not initialized or gtag is missing.");
  }
};
