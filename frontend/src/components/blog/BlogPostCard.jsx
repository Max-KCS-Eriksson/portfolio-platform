import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { buildRoute } from "../../routes/paths";
import { formatDate } from "../../utils/formatDate";
import "./BlogTags.css";
import "./BlogPostCard.css";

function BlogPostCard({ blogPost }) {
  const titleId = `blog-post-card-title-${blogPost.id ?? blogPost.slug}`;
  const detailPath = buildRoute.blogPostDetail(blogPost.slug);

  return (
    <article className="card blog-post-card">
      <Link className="blog-post-card__overlay-link" to={detailPath} aria-labelledby={titleId} />

      <div className="blog-post-card__content">
        <h3 className="blog-post-card__title" id={titleId}>
          {blogPost.title}
        </h3>

        <p className="blog-post-card__intro">{blogPost.intro}</p>

        <div className="blog-post-card__meta">
          <span className="blog-post-card__date">
            <FontAwesomeIcon icon={faCalendar} aria-hidden="true" />
            <time dateTime={blogPost.dateAdded}>{formatDate(blogPost.dateAdded)}</time>
          </span>
        </div>
      </div>

      <div className="blog-post-card__footer">
        {blogPost.tags.length > 0 && (
          <ul className="blog-tag-list blog-post-card__tags" aria-label={`${blogPost.title} tags`}>
            {blogPost.tags.map((tag) => (
              <li className="blog-tag-chip tag" key={tag}>
                {tag}
              </li>
            ))}
          </ul>
        )}

        <Link
          className="blog-post-card__cta"
          to={detailPath}
          aria-label={`Read post: ${blogPost.title}`}
        >
          <span>Read post</span>
          <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export default BlogPostCard;
