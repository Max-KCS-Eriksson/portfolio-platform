import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getBlogPost } from "../api/blogApi";
import { usePageTitle } from "../hooks/usePageTitle";
import { buildRoute } from "../routes/paths";

function renderLinebreaks(text) {
  return text?.split(/\r?\n/).map((line, index) => <p key={index}>{line}</p>);
}

function slugifyTag(tag) {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function copySnippet(snippet) {
  await navigator.clipboard.writeText(snippet);
}

function BlogPostDetailPage() {
  const { slug } = useParams();
  const [blogPost, setBlogPost] = useState(null);
  const [error, setError] = useState(null);

  usePageTitle(blogPost?.title ?? "Blog");

  useEffect(() => {
    setBlogPost(null);
    setError(null);

    getBlogPost(slug)
      .then(setBlogPost)
      .catch((error) => {
        console.error(error);
        setError(error);
      });
  }, [slug]);

  if (error) {
    return (
      <>
        <h1 className="title">Blog</h1>
        <p className="description">Could not load blog post.</p>
      </>
    );
  }

  if (!blogPost) {
    return (
      <>
        <h1 className="title">Blog</h1>
        <p className="description">Loading...</p>
      </>
    );
  }

  return (
    <>
      <h1 className="title">{blogPost.title}</h1>

      {blogPost.summary && <p className="summary">{blogPost.summary}</p>}

      <div className="intro">{renderLinebreaks(blogPost.intro)}</div>

      <section className="tags">
        {blogPost.tags?.map((tag) => (
          <Link className="tag" to={buildRoute.blogTag(slugifyTag(tag))} key={tag}>
            {tag}
          </Link>
        ))}
      </section>

      {blogPost.paragraphs?.map((paragraph) => (
        <section className="paragraph-section" key={paragraph.id}>
          <h2 className="heading">{paragraph.heading}</h2>
          <p className="paragraph">{paragraph.text}</p>

          {paragraph.snippets?.map((snippet) => (
            <section className="snippet-section" key={snippet.id}>
              {snippet.intended_location && (
                <h1 className="snippet-intendet-location">{snippet.intended_location}</h1>
              )}

              <section>
                <pre className="snippet-box">
                  <code className={`snippet${snippet.side_scroll ? " scroll" : ""}`}>
                    {snippet.snippet}
                  </code>
                </pre>
                <button className="copy-snippet" onClick={() => copySnippet(snippet.snippet)}>
                  <i className="fa-regular fa-copy"></i>
                </button>
              </section>

              <div className="snippet-description">{renderLinebreaks(snippet.description)}</div>
            </section>
          ))}
        </section>
      ))}
    </>
  );
}

export default BlogPostDetailPage;
