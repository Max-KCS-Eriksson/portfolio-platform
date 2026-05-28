import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from "@fortawesome/free-regular-svg-icons";
import { faTag } from "@fortawesome/free-solid-svg-icons";
import { Link, useParams } from "react-router-dom";
import { getBlogContext, getBlogPosts, getBlogPostsByTag } from "../api/blogApi";
import HeroSection from "../components/core/HeroSection";
import BlogPostCard from "../components/blog/BlogPostCard";
import OverviewCardSection from "../components/core/OverviewCardSection";
import { usePageTitle } from "../hooks/usePageTitle";
import { buildRoute } from "../routes/paths";
import { slugifyTag } from "../utils/slugifyTag";
import "../components/blog/BlogTags.css";
import "./BlogOverviewPage.css";

function BlogOverviewPage() {
  const { tag } = useParams();
  const [blogContext, setBlogContext] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const [allBlogPosts, setAllBlogPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isClearFilterHovered, setIsClearFilterHovered] = useState(false);

  usePageTitle("Blog");

  useEffect(() => {
    setBlogPosts([]);
    setAllBlogPosts([]);
    setError(null);

    if (!tag) {
      Promise.all([getBlogContext(), getBlogPosts()])
        .then(([blogContext, blogPosts]) => {
          setBlogContext(blogContext);
          setBlogPosts(blogPosts);
          setAllBlogPosts(blogPosts);
        })
        .catch((error) => {
          console.error(error);
          setError(error);
        });
      return;
    }

    Promise.all([getBlogContext(), getBlogPostsByTag(tag), getBlogPosts()])
      .then(([blogContext, blogPosts, allBlogPosts]) => {
        setBlogContext(blogContext);
        setBlogPosts(blogPosts);
        setAllBlogPosts(allBlogPosts);
      })
      .catch((error) => {
        console.error(error);
        setError(error);
      });
  }, [tag]);

  const tags = useMemo(() => {
    const tagNames = allBlogPosts.flatMap((blogPost) => blogPost.tags ?? []);
    return [...new Set(tagNames)].map((name) => ({ name, slug: slugifyTag(name) }));
  }, [allBlogPosts]);

  const selectedTag = tags.find((tagItem) => tagItem.slug === tag);
  const intro = blogContext?.intro || "Blog intro TBD";
  const postsHeading = selectedTag ? `${selectedTag.name} Posts` : "All Posts";
  const tagFilterIconElement = selectedTag ? (
    <Link
      className={`blog-overview-page__tag-filter-icon-link ${isClearFilterHovered ? "clear" : ""}`}
      to={buildRoute.blog()}
      aria-label="Clear tag filter"
      onMouseEnter={() => setIsClearFilterHovered(true)}
      onMouseLeave={() => setIsClearFilterHovered(false)}
      onFocus={() => setIsClearFilterHovered(true)}
      onBlur={() => setIsClearFilterHovered(false)}
    >
      <FontAwesomeIcon className="blog-overview-page__tag-filter-icon" icon={faTag} aria-hidden="true" />
    </Link>
  ) : (
    <FontAwesomeIcon className="blog-overview-page__tag-filter-icon" icon={faTag} aria-hidden="true" />
  );

  const heroActions =
    tags.length > 0 ? (
      <nav className="blog-overview-page__tag-filter" aria-label="Blog tags">
        {tagFilterIconElement}

        <ul className="blog-tag-list">
          {tags.map((tagItem) => (
            <li key={tagItem.slug}>
              <Link
                className={`blog-tag-chip tag ${tagItem.slug === tag ? "active" : ""}`}
                to={tagItem.slug === tag ? buildRoute.blog() : buildRoute.blogTag(tagItem.slug)}
              >
                {tagItem.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    ) : null;

  if (error) {
    return (
      <div className="blog-overview-page">
        <HeroSection headline="Blog" intro={intro} actions={heroActions} visual={<FontAwesomeIcon icon={faFileLines} />} />
        <p className="description">Could not load blog posts.</p>
      </div>
    );
  }

  return (
    <div className="blog-overview-page">
      <HeroSection headline="Blog" intro={intro} actions={heroActions} visual={<FontAwesomeIcon icon={faFileLines} />} />

      {blogPosts.length > 0 ? (
        <OverviewCardSection
          id="blog-posts"
          heading={postsHeading}
          itemCount={blogPosts.length}
          className="blog-posts-section"
          itemClassName="blog-posts-section__item"
          secondary={true}
        >
          {blogPosts.map((blogPost) => (
            <BlogPostCard blogPost={blogPost} key={blogPost.id ?? blogPost.slug} />
          ))}
        </OverviewCardSection>
      ) : (
        <section className="blog-posts-section" aria-label="Blog posts">
          <h1 className="title">Blog</h1>
          <p className="description">Coming soon</p>
        </section>
      )}
    </div>
  );
}

export default BlogOverviewPage;
