import { apiGet } from "./client";
import { mapFrontendContext, mapHero, mapAboutPage } from "./coreMapper";

export function getFrontendContext() {
  return apiGet("/context/").then(mapFrontendContext);
}

export function getHero() {
  return apiGet("/hero/").then(mapHero);
}

export function getAboutPage() {
  return apiGet("/about/").then(mapAboutPage);
}
