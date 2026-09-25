import { BIZ } from "../data/site.js";

export const DEFAULT_WA_MESSAGE = "Hi 360 Biz Health, I'd like to discuss a business requirement.";

export function waLink(msg) {
  return "https://wa.me/" + BIZ.whatsapp + "?text=" + encodeURIComponent(msg || DEFAULT_WA_MESSAGE);
}
export const telLink = () => "tel:" + BIZ.phoneHref;
export const mailLink = () => "mailto:" + BIZ.email;
