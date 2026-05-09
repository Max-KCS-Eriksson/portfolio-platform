export function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function asString(value, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

export function asBoolean(value, fallback) {
  return typeof value === "boolean" ? value : fallback;
}

export function asNumber(value, fallback = 0) {
  return typeof value === "number" ? value : fallback;
}

export function asOptionalNumber(value) {
  return typeof value === "number" ? value : undefined;
}

export function asArray(value) {
  return Array.isArray(value) ? value : [];
}
