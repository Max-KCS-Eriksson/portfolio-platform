export const ROUTES = {
  home: "/",
  portfolio: "/portfolio/",
  projectDetail: (slug) => `/portfolio/${encodeURIComponent(slug)}/`,
  blog: "/blog/",
  about: "/about/",
};
