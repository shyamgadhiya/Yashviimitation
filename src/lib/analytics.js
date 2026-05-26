const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();

function ensureAnalyticsLoaded() {
  if (!GA_MEASUREMENT_ID || typeof document === "undefined" || document.getElementById("ga-script")) return;

  const script = document.createElement("script");
  script.id = "ga-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });
}

export function initAnalytics() {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined") return;
  ensureAnalyticsLoaded();
}

export function trackPageView(path, title) {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined") return;
  ensureAnalyticsLoaded();
  if (!window.gtag) return;

  window.gtag("event", "page_view", {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
  });
}

export function trackLead(type, details = {}) {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined") return;
  ensureAnalyticsLoaded();
  if (!window.gtag) return;

  window.gtag("event", "generate_lead", {
    event_category: "lead_generation",
    lead_type: type,
    ...details,
  });
}
