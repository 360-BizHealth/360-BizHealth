/*
 * Captures campaign parameters and the landing page once per browser session so
 * an enquiry can record where the visitor came from. sessionStorage may be
 * unavailable (private mode, blocked storage); every access is guarded and the
 * form works without it.
 */
import { UTM_PARAM_KEYS } from "../../shared/enquiry.js";

const KEY = "bh_attribution";
let memory = null;

export function captureAttribution() {
  if (typeof window === "undefined") return {};
  let store = memory || {};
  try { store = JSON.parse(window.sessionStorage.getItem(KEY) || "null") || store; } catch { /* storage unavailable */ }
  const q = new URLSearchParams(window.location.search);
  store.utm = store.utm || {};
  UTM_PARAM_KEYS.forEach((k) => { if (q.get(k)) store.utm[k] = q.get(k).slice(0, 200); });
  if (!store.referrer) store.referrer = (document.referrer || "direct").slice(0, 500);
  if (!store.landing) store.landing = (window.location.pathname + window.location.search).slice(0, 500);
  memory = store;
  try { window.sessionStorage.setItem(KEY, JSON.stringify(store)); } catch { /* storage unavailable */ }
  return store;
}

export function getAttribution() {
  return memory || captureAttribution();
}
