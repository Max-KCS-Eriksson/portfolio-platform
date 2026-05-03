import { apiGet } from "./client";
import { mapProject, mapProjects } from "./projectMapper";

const API_PATH = "/portfolio";

export function getProjects() {
  return apiGet(`${API_PATH}/`).then(mapProjects);
}

export function getProject(slug) {
  return apiGet(`${API_PATH}/${encodeURIComponent(slug)}/`).then(mapProject);
}
