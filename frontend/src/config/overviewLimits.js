// Project grid group size used to avoid empty project-card slots.
const PROJECT_OVERVIEW_LAYOUT_MAX_GRID_COLUMNS = 3;

// Keep project overview limits divisible by PROJECT_OVERVIEW_LAYOUT_MAX_GRID_COLUMNS.
// Overview project counts should form complete grid groups across responsive layouts.
const DEFAULT_OVERVIEW_LIMITS = {
  featuredProjectOverviewLimit: PROJECT_OVERVIEW_LAYOUT_MAX_GRID_COLUMNS,
  otherProjectOverviewLimit: PROJECT_OVERVIEW_LAYOUT_MAX_GRID_COLUMNS * 2,
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

export function getProjectOverviewLayoutGroupSize() {
  return PROJECT_OVERVIEW_LAYOUT_MAX_GRID_COLUMNS;
}
