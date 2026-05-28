import { apiGet } from "./client";
import { mapBlogContext, mapBlogPost, mapBlogPosts } from "./blogMapper";

const API_PATH = "/blog";

export function getBlogPosts() {
  return apiGet(`${API_PATH}/`).then(mapBlogPosts);
}

export function getBlogPostsByTag(tag) {
  return apiGet(`${API_PATH}/tag/${encodeURIComponent(tag)}/`).then(mapBlogPosts);
}

export function getBlogPost(slug) {
  return apiGet(`${API_PATH}/${encodeURIComponent(slug)}/`).then(mapBlogPost);
}

export function getBlogContext() {
  return apiGet(`${API_PATH}/context/`).then(mapBlogContext);
}
