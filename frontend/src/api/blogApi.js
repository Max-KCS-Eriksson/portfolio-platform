import { apiGet } from "./client";

const API_PATH = "/blog";

export function getBlogPosts() {
  return apiGet(`${API_PATH}/`);
}

export function getBlogPostsByTag(tag) {
  return apiGet(`${API_PATH}/tag/${encodeURIComponent(tag)}/`);
}

export function getBlogPost(slug) {
  return apiGet(`${API_PATH}/${encodeURIComponent(slug)}/`);
}
