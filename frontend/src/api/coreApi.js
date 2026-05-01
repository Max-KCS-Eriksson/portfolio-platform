import { apiGet } from "./client";

export function getFrontendContext() {
  return apiGet("/context/");
}

export function getAboutPage() {
  return apiGet("/about/");
}
