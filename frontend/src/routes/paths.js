export const ROUTES = {
  home: "/",
  portfolio: "/portfolio/",
  portfolioFeatured: "/portfolio/featured",
  portfolioProjects: "/portfolio/projects",
  projectDetail: "/portfolio/:slug",
  blog: "/blog/",
  blogTag: "/blog/tag/:tag",
  blogPostDetail: "/blog/:slug",
  about: "/about/",
  status500: "/500/",
  notFound: "*",
};

export const buildRoute = {
  portfolioFeatured: () => "/portfolio/featured",
  portfolioProjects: () => "/portfolio/projects",
  projectDetail: (slug) => `/portfolio/${encodeURIComponent(slug)}/`,
  blog: () => "/blog/",
  blogTag: (tag) => `/blog/tag/${encodeURIComponent(tag)}/`,
  blogPostDetail: (slug) => `/blog/${encodeURIComponent(slug)}/`,
};
