/* Pushes events to window.dataLayer (Google Tag Manager compatible). No-op during prerendering. */
export function track(name, data) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(Object.assign({ event: name }, data || {}));
}

export function currentPath() {
  return typeof window === "undefined" ? "/" : window.location.pathname || "/";
}
