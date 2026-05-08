import { asArray, asBoolean, asString, isObject } from "./mapperUtils";

function mapBlogPostSnippet(snippet) {
  if (!isObject(snippet)) {
    return null;
  }

  return {
    id: snippet.id ?? null,
    paragraph: snippet.paragraph ?? null,
    snippet: asString(snippet.snippet),
    sideScroll: asBoolean(snippet.side_scroll ?? snippet.sideScroll, false),
    description: asString(snippet.description),
    intendedLocation: asString(snippet.intended_location ?? snippet.intendedLocation),
  };
}

function mapBlogPostParagraph(paragraph) {
  if (!isObject(paragraph)) {
    return null;
  }

  return {
    id: paragraph.id ?? null,
    blogPost: paragraph.blog_post ?? paragraph.blogPost ?? null,
    heading: asString(paragraph.heading),
    text: asString(paragraph.text),
    snippets: asArray(paragraph.snippets).map(mapBlogPostSnippet).filter(Boolean),
  };
}

export function mapBlogPost(blogPost) {
  if (!isObject(blogPost)) {
    return null;
  }

  return {
    id: blogPost.id ?? null,
    title: asString(blogPost.title, "Blog post title TBD"),
    intro: asString(blogPost.intro, "Blog post intro TBD"),
    paragraphs: asArray(blogPost.paragraphs).map(mapBlogPostParagraph).filter(Boolean),
    tags: asArray(blogPost.tags).filter((tag) => typeof tag === "string"),
    dateAdded: asString(blogPost.date_added ?? blogPost.dateAdded),
    slug: asString(blogPost.slug),
  };
}

export function mapBlogPosts(blogPosts) {
  return asArray(blogPosts).map(mapBlogPost).filter(Boolean);
}
