import { labels as es } from "./es.js";
import { labels as en } from "./en.js";

export default function getLabels(lang) {
  switch (lang) {
    case "es":
      return es;
    case "en":
    default:
      return en;
  }
}
