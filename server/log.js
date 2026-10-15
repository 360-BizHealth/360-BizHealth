/*
 * Structured server logging. Only pass identifiers and error codes here, never
 * request bodies, passwords, tokens, e-mail addresses or phone numbers.
 */
const REDACT = /(password|token|secret|authorization|cookie|email|phone|message|apikey|api_key)/i;

function scrub(meta) {
  if (!meta || typeof meta !== "object") return meta;
  const out = {};
  for (const [k, v] of Object.entries(meta)) {
    if (REDACT.test(k)) out[k] = "[redacted]";
    else if (v instanceof Error) out[k] = { name: v.name, code: v.code, message: String(v.message).slice(0, 300) };
    else if (v && typeof v === "object") out[k] = scrub(v);
    else out[k] = typeof v === "string" ? v.slice(0, 300) : v;
  }
  return out;
}

function write(level, event, meta) {
  if (process.env.BH_SILENT_LOGS === "true") return;
  const line = JSON.stringify({ level, event, time: new Date().toISOString(), ...scrub(meta) });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const log = {
  info: (event, meta) => write("info", event, meta),
  warn: (event, meta) => write("warn", event, meta),
  error: (event, meta) => write("error", event, meta),
};
