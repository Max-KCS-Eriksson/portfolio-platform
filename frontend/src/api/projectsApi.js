import { apiGet } from "./client";

const API_PATH = "/portfolio";

export function getProjects() {
  return apiGet(`${API_PATH}/`);
}

export function getProject(slug) {
  return apiGet(`${API_PATH}/${encodeURIComponent(slug)}/`);
}
