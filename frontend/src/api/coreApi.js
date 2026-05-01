import { apiGet } from "./client";

export function getFrontendContext() {
  return apiGet("/api/context/");
}
