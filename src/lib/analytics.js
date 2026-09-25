/* Pushes events to window.dataLayer, exactly as the original build did. */
export function track(name, data) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(Object.assign({ event: name }, data || {}));
}

export function currentPath() {
  return window.location.pathname || "/";
}
