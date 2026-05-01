export const ROUTES = {
  home: "/",
  portfolio: "/portfolio/",
  projectDetail: "/portfolio/:slug",
  blog: "/blog/",
  about: "/about/",
};

export const buildRoute = {
  projectDetail: (slug) => `/portfolio/${encodeURIComponent(slug)}/`,
};
