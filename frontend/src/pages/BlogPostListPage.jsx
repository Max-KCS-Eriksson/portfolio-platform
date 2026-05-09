import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Link, useParams } from "react-router-dom";
import { getBlogPosts, getBlogPostsByTag } from "../api/blogApi";
import { usePageTitle } from "../hooks/usePageTitle";
import { buildRoute } from "../routes/paths";
import { slugifyTag } from "../utils/slugifyTag";

function BlogPostListPage() {
  const { tag } = useParams();
  const [blogPosts, setBlogPosts] = useState([]);
  const [allBlogPosts, setAllBlogPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isTagsMenuOpen, setIsTagsMenuOpen] = useState(false);

  usePageTitle("Blog");

  useEffect(() => {
    setBlogPosts([]);
    setAllBlogPosts([]);
    setError(null);

    if (!tag) {
      getBlogPosts()
        .then((blogPosts) => {
          setBlogPosts(blogPosts);
          setAllBlogPosts(blogPosts);
        })
        .catch((error) => {
          console.error(error);
          setError(error);
        });
      return;
    }

    Promise.all([getBlogPostsByTag(tag), getBlogPosts()])
      .then(([blogPosts, allBlogPosts]) => {
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

  function toggleTagsMenu() {
    setIsTagsMenuOpen((current) => !current);
  }

  function closeTagsMenu() {
    setIsTagsMenuOpen(false);
  }

  function getTagsMenuButtonClassName() {
    return `tags-menu-button ${isTagsMenuOpen ? "active" : ""}`;
  }

  function getTagsMenuClassName() {
    return isTagsMenuOpen ? "active" : "";
  }

  if (error) {
    return (
      <div className="main-menu">
        <h1 className="title">Blog</h1>
        <p className="description">Could not load blog posts.</p>
      </div>
    );
  }

  return (
    <>
      {tags.length > 0 && (
        <nav id="tags-nav">
          <button
            id="tags-menu-button"
            className={getTagsMenuButtonClassName()}
            type="button"
            aria-label="Toggle tags menu"
            aria-expanded={isTagsMenuOpen}
            onClick={toggleTagsMenu}
          >
            <FontAwesomeIcon icon={faTag} aria-hidden="true" />
          </button>

          {selectedTag && (
            <>
              <h1 className="tag">{selectedTag.name}</h1>
              <Link
                className="remove-tag-filter"
                to={buildRoute.blog()}
                aria-label="Remove tag filter"
                onClick={closeTagsMenu}
              >
                <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
              </Link>
            </>
          )}

          <ul id="tags-menu" className={getTagsMenuClassName()}>
            {tags.map((tagItem) => (
              <li className="nav-item" key={tagItem.slug}>
                <Link className="nav-link" to={buildRoute.blogTag(tagItem.slug)} onClick={closeTagsMenu}>
                  {tagItem.name}
                  <span className="path">/</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="main-menu">
        {blogPosts.length > 0 ? (
          <ul>
            {blogPosts.map((blogPost) => (
              <li className="nav-item" key={blogPost.id ?? blogPost.slug}>
                <h2>
                  <Link className="nav-link" to={buildRoute.blogPostDetail(blogPost.slug)}>
                    {blogPost.title}
                    <span className="path">/</span>
                  </Link>
                </h2>
                <p className="intro">{blogPost.intro}</p>
              </li>
            ))}
          </ul>
        ) : (
          <>
            <h1 className="title">Blog</h1>
            <p className="description">Coming soon</p>
          </>
        )}
      </div>
    </>
  );
}

export default BlogPostListPage;
