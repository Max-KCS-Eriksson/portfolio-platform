export async function apiGet(path) {
  const response = await fetch(path);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GET ${path} failed with ${response.status}: ${text}`);
  }

  return response.json();
}
