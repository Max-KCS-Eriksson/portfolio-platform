export const ROUTES = {
  home: "/",
  portfolio: "/portfolio/",
  projectDetail: "/portfolio/:slug",
  blog: "/blog/",
  blogTag: "/blog/tag/:tag",
  blogPostDetail: "/blog/:slug",
  about: "/about/",
  status500: "/500/",
  notFound: "*",
};

export const buildRoute = {
  projectDetail: (slug) => `/portfolio/${encodeURIComponent(slug)}/`,
  blog: () => "/blog/",
  blogTag: (tag) => `/blog/tag/${encodeURIComponent(tag)}/`,
  blogPostDetail: (slug) => `/blog/${encodeURIComponent(slug)}/`,
};
