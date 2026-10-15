/* Lower-cases a label for use mid-sentence while keeping acronyms (HRMS, TDS, IPR, ISO) intact. */
export function midSentence(label) {
  return String(label)
    .split(" ")
    .map((w) => (/^[A-Z0-9&/]{2,}[,.]?$/.test(w) ? w : w.toLowerCase()))
    .join(" ");
}
