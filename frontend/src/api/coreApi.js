import { apiGet } from "./client";
import { mapContextData, mapHero, mapAbout } from "./coreMapper";

export function getContextData() {
  return apiGet("/context/").then(mapContextData);
}

export function getHero() {
  return apiGet("/hero/").then(mapHero);
}

export function getAbout() {
  return apiGet("/about/").then(mapAbout);
}
