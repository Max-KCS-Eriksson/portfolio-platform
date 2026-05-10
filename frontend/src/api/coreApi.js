import { apiGet } from "./client";
import { mapCoreContext, mapHero, mapAbout } from "./coreMapper";

export function getCoreContext() {
  return apiGet("/core/context/").then(mapCoreContext);
}

export function getHero() {
  return apiGet("/hero/").then(mapHero);
}

export function getAbout() {
  return apiGet("/about/").then(mapAbout);
}
