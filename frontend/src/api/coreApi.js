import { apiGet } from "./client";
import { mapFrontendContext } from "./coreMapper";

export function getFrontendContext() {
  return apiGet("/context/").then(mapFrontendContext);
}

export function getAboutPage() {
  return apiGet("/about/");
}
