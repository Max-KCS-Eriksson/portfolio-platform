export const ROUTES = {
  home: "/",
  portfolio: "/portfolio/",
  projectDetail: "/portfolio/:slug",
  blog: "/blog/",
  blogTag: "/blog/tag/:tag",
  blogPostDetail: "/blog/:slug",
  about: "/about/",
  notFound: "*",
};

export const buildRoute = {
  projectDetail: (slug) => `/portfolio/${encodeURIComponent(slug)}/`,
  blog: () => "/blog/",
  blogTag: (tag) => `/blog/tag/${encodeURIComponent(tag)}/`,
  blogPostDetail: (slug) => `/blog/${encodeURIComponent(slug)}/`,
};
