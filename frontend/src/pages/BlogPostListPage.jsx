import { useEffect, useMemo, useState } from "react";
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

    const blogPostsRequest = tag ? getBlogPostsByTag(tag) : getBlogPosts();

    Promise.all([blogPostsRequest, getBlogPosts()])
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

  function handleTagsMenuKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleTagsMenu();
    }
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
          <i
            id="tags-menu-button"
            className={`fa-solid fa-tag tags-menu-button ${isTagsMenuOpen ? "active" : ""}`}
            role="button"
            tabIndex="0"
            aria-label="Toggle tags menu"
            aria-expanded={isTagsMenuOpen}
            onClick={toggleTagsMenu}
            onKeyDown={handleTagsMenuKeyDown}
          ></i>

          {selectedTag && (
            <>
              <h1 className="tag">{selectedTag.name}</h1>
              <Link className="remove-tag-filter" to={buildRoute.blog()} onClick={closeTagsMenu}>
                <i className="fa-solid fa-xmark"></i>
              </Link>
            </>
          )}

          <ul id="tags-menu" className={isTagsMenuOpen ? "active" : ""}>
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
