import { apiGet } from "./client";

export function getProjects() {
  return apiGet("/api/portfolio/");
}

export function getProject(slug) {
  return apiGet(`/api/portfolio/${slug}/`);
}
