/*
 * Optional Cloudflare Turnstile verification. Active only when
 * TURNSTILE_SECRET_KEY is set (and VITE_TURNSTILE_SITE_KEY on the frontend).
 * Without it, the honeypot, timing check and rate limits still apply.
 */
import { config } from "./config.js";
import { HttpError } from "./http.js";
import { log } from "./log.js";

export async function verifyTurnstile(token, ip) {
  const secret = config.turnstileSecret;
  if (!secret) return;
  if (!token || typeof token !== "string" || token.length > 2048) {
    throw new HttpError(400, "captcha_required", "Please complete the verification check and send again.");
  }
  let ok = false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(6000),
    });
    const j = await res.json();
    ok = Boolean(j && j.success);
  } catch (err) {
    log.error("turnstile_unreachable", { err });
    throw new HttpError(503, "captcha_unavailable", "We could not verify the form just now. Please try again in a minute.");
  }
  if (!ok) throw new HttpError(400, "captcha_failed", "The verification check did not pass. Please try again.");
}
