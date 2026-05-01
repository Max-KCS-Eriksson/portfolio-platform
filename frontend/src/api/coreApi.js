import { apiGet } from "./client";

export function getFrontendContext() {
  return apiGet("/api/context/");
}

export function getAboutPage() {
  return apiGet("/api/about/");
}
