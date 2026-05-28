import { asArray, asString, isObject } from "./mapperUtils";

function mapBlogContentBlock(block) {
  if (!isObject(block)) {
    return null;
  }

  const type = asString(block.type);

  if (type === "section") {
    return {
      type,
      heading: asString(block.heading),
      blocks: asArray(block.blocks).map(mapBlogContentBlock).filter(Boolean),
    };
  }

  if (type === "snippet") {
    return {
      type,
      context: asString(block.context),
      snippet: asString(block.snippet),
      description: asString(block.description),
    };
  }

  if (type === "title" || type === "intro" || type === "paragraph") {
    return {
      type,
      text: asString(block.text),
    };
  }

  return null;
}

export function mapBlogPost(blogPost) {
  if (!isObject(blogPost)) {
    return null;
  }

  return {
    id: blogPost.id ?? null,
    title: asString(blogPost.title),
    intro: asString(blogPost.intro),
    content: asArray(blogPost.content).map(mapBlogContentBlock).filter(Boolean),
    tags: asArray(blogPost.tags).filter((tag) => typeof tag === "string"),
    dateAdded: asString(blogPost.date_added ?? blogPost.dateAdded),
    slug: asString(blogPost.slug),
  };
}

export function mapBlogPosts(blogPosts) {
  return asArray(blogPosts).map(mapBlogPost).filter(Boolean);
}

export function mapBlogContext(blogContext) {
  if (!isObject(blogContext)) {
    return null;
  }

  return {
    id: blogContext.id ?? null,
    intro: asString(blogContext.intro),
  };
}
