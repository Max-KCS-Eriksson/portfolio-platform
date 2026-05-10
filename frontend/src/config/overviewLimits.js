const DEFAULT_OVERVIEW_LIMITS = {
  featuredProjectOverviewLimit: 3,
  otherProjectOverviewLimit: 6,
  blogOverviewLimit: 2,
};

export function limitOverviewItems(items, limit) {
  return items.slice(0, limit);
}

export function getFeaturedProjectOverviewLimit() {
  return DEFAULT_OVERVIEW_LIMITS.featuredProjectOverviewLimit;
}

export function getOtherProjectOverviewLimit() {
  return DEFAULT_OVERVIEW_LIMITS.otherProjectOverviewLimit;
}

export function getBlogOverviewLimit() {
  return DEFAULT_OVERVIEW_LIMITS.blogOverviewLimit;
}
