const DEFAULT_OVERVIEW_LIMITS = {
  projectOverviewLimit: 3,
  blogOverviewLimit: 2,
};

function isValidOverviewLimit(value) {
  return Number.isInteger(value) && value >= 0;
}

function getOverviewLimit(value, fallback) {
  return isValidOverviewLimit(value) ? value : fallback;
}

export function limitOverviewItems(items, limit) {
  return items.slice(0, limit);
}

export function getProjectOverviewLimit(coreContext) {
  return getOverviewLimit(
    coreContext?.projectOverviewLimit,
    DEFAULT_OVERVIEW_LIMITS.projectOverviewLimit,
  );
}

export function getBlogOverviewLimit(coreContext) {
  return getOverviewLimit(
    coreContext?.blogOverviewLimit,
    DEFAULT_OVERVIEW_LIMITS.blogOverviewLimit,
  );
}
