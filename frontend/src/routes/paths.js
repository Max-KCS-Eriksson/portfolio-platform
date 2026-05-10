export const ROUTES = {
  home: "/",
  portfolio: "/portfolio/",
  portfolioFeatured: "/portfolio/featured",
  portfolioProjects: "/portfolio/projects",
  projectDetail: "/portfolio/:slug",
  about: "/about/",
  status500: "/500/",
  notFound: "*",
};

export const buildRoute = {
  portfolioFeatured: () => "/portfolio/featured",
  portfolioProjects: () => "/portfolio/projects",
  projectDetail: (slug) => `/portfolio/${encodeURIComponent(slug)}/`,
};
