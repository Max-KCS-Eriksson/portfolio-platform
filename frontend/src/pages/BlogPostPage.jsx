import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faFileLines } from "@fortawesome/free-regular-svg-icons";
import { useParams } from "react-router-dom";
import { getBlogPost } from "../api/blogApi";
import CodeSnippet from "../components/core/CodeSnippet";
import HeroSection from "../components/core/HeroSection";
import { usePageTitle } from "../hooks/usePageTitle";
import { formatDate } from "../utils/formatDate";
import { renderLinebreaks } from "../utils/renderLinebreaks";
import "../components/blog/BlogTags.css";
import "./BlogPostPage.css";

function getSectionBlocks(content) {
  return content?.filter((block) => block.type === "section") ?? [];
}

function slugifyHeading(heading, index) {
  const slug = heading
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || `section-${index + 1}`;
}

function renderContentBlock(block, key) {
  if (block.type === "title" || block.type === "intro") {
    return null;
  }

  if (block.type === "paragraph") {
    return (
      <p className="paragraph" key={key}>
        {renderLinebreaks(block.text)}
      </p>
    );
  }

  if (block.type === "snippet") {
    return <CodeSnippet heading={block.context} code={block.snippet} description={block.description} key={key} />;
  }

  return null;
}

function BlogPostPage() {
  const { slug } = useParams();
  const [blogPost, setBlogPost] = useState(null);
  const [error, setError] = useState(null);
  const [activeSectionId, setActiveSectionId] = useState("");

  const sectionBlocks = useMemo(() => getSectionBlocks(blogPost?.content), [blogPost?.content]);
  const sectionLinks = useMemo(
    () =>
      sectionBlocks.map((section, index) => ({
        id: slugifyHeading(section.heading, index),
        label: `${index + 1}. ${section.heading}`,
      })),
    [sectionBlocks],
  );

  usePageTitle(blogPost?.title ?? "Blog");

  useEffect(() => {
    setBlogPost(null);
    setError(null);
    setActiveSectionId("");

    getBlogPost(slug)
      .then(setBlogPost)
      .catch((error) => {
        console.error(error);
        setError(error);
      });
  }, [slug]);

  useEffect(() => {
    if (sectionLinks.length === 0) {
      return undefined;
    }

    setActiveSectionId(sectionLinks[0].id);

    if (!window.IntersectionObserver) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((firstEntry, secondEntry) => firstEntry.boundingClientRect.top - secondEntry.boundingClientRect.top)[0];

        if (visibleEntry?.target.id) {
          setActiveSectionId(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: 0,
      },
    );

    sectionLinks.forEach((sectionLink) => {
      const sectionElement = document.getElementById(sectionLink.id);

      if (sectionElement) {
        observer.observe(sectionElement);
      }
    });

    return () => observer.disconnect();
  }, [sectionLinks]);

  if (error) {
    return (
      <div className="blog-post-page">
        <HeroSection headline="Blog" intro="Could not load blog post." visual={<FontAwesomeIcon icon={faFileLines} />} />
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="blog-post-page">
        <HeroSection headline="Blog" intro="Loading..." visual={<FontAwesomeIcon icon={faFileLines} />} />
      </div>
    );
  }

  const heroMeta = (
    <div className="blog-post-page__meta">
      <span className="blog-post-page__date">
        <FontAwesomeIcon icon={faCalendar} aria-hidden="true" />
        <time dateTime={blogPost.dateAdded}>{formatDate(blogPost.dateAdded)}</time>
      </span>

      {blogPost.tags.length > 0 && (
        <>
          <span className="blog-post-page__meta-separator" aria-hidden="true" />

          <ul className="blog-tag-list blog-post-page__tags" aria-label={`${blogPost.title} tags`}>
            {blogPost.tags.map((tag) => (
              <li className="blog-tag-chip tag" key={tag}>
                {tag}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );

  return (
    <article className="blog-post-page">
      <HeroSection
        headline={blogPost.title}
        meta={heroMeta}
        intro={blogPost.intro}
        visual={<FontAwesomeIcon icon={faFileLines} />}
      />

      <div className="blog-post-page__layout">
        <div className="blog-post-page__content">
          {sectionBlocks.map((section, sectionIndex) => (
            <section
              className="card blog-post-page__section"
              id={sectionLinks[sectionIndex].id}
              aria-labelledby={`${sectionLinks[sectionIndex].id}-heading`}
              key={sectionLinks[sectionIndex].id}
            >
              <div className="blog-post-page__section-content">
                <h2
                  id={`${sectionLinks[sectionIndex].id}-heading`}
                  aria-label={`${String(sectionIndex + 1).padStart(2, "0")} ${section.heading}`}
                >
                  <span className="blog-post-page__section-marker">{String(sectionIndex + 1).padStart(2, "0")}</span>
                  <span className="blog-post-page__section-title">{section.heading}</span>
                </h2>
                {section.blocks.map((childBlock, index) => renderContentBlock(childBlock, `${sectionIndex}-${index}`))}
              </div>
            </section>
          ))}
        </div>

        {sectionLinks.length > 0 && (
          <aside className="blog-post-page__toc" aria-label="On this page">
            <h2>On this page</h2>
            <ol>
              {sectionLinks.map((sectionLink) => (
                <li key={sectionLink.id}>
                  <a
                    className={sectionLink.id === activeSectionId ? "current" : ""}
                    href={`#${sectionLink.id}`}
                    aria-current={sectionLink.id === activeSectionId ? "true" : undefined}
                    onClick={() => setActiveSectionId(sectionLink.id)}
                  >
                    {sectionLink.label}
                  </a>
                </li>
              ))}
            </ol>
          </aside>
        )}
      </div>
    </article>
  );
}

export default BlogPostPage;
