const DEFAULT_OVERVIEW_LIMITS = {
  projectOverviewLimit: 3,
  blogOverviewLimit: 2,
};

export function limitOverviewItems(items, limit) {
  return items.slice(0, limit);
}

export function getProjectOverviewLimit() {
  return DEFAULT_OVERVIEW_LIMITS.projectOverviewLimit;
}

export function getBlogOverviewLimit() {
  return DEFAULT_OVERVIEW_LIMITS.blogOverviewLimit;
}
