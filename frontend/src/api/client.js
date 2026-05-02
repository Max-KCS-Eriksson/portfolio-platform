const API_BASE_PATH = "/api";

export async function apiGet(endpoint) {
  const normalizedPath = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const path = `${API_BASE_PATH}${normalizedPath}`;

  const response = await fetch(path);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GET ${path} failed with ${response.status}: ${text}`);
  }

  return response.json();
}
