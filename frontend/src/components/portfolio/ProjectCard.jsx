import { Link } from "react-router-dom";
import SocialMediaLinks from "../layout/SocialMediaLinks";
import { buildRoute } from "../../routes/paths";
import { renderLinebreaks } from "../../utils/renderLinebreaks";
import { slugifyTag } from "../../utils/slugifyTag";
import "./ProjectCard.css";

function getProjectCardClassName(ctaCard, tight) {
  return ["project-card card", ctaCard ? "cta-card" : "", tight ? "secondary" : ""].filter(Boolean).join(" ");
}

function getRepoLinks(project) {
  const slug = getProjectSlug(project);

  return [{ id: `${project.id ?? slug}-repo`, social_media: "gh", url: project.repo_url }];
}

function getProjectSlug(project) {
  return project.slug || slugifyTag(project.title);
}

/**
 * Render a project summary card.
 *
 * @param {object} props
 * @param {object} props.project
 * Project data rendered in the card.
 * @param {boolean} [props.ctaCard]
 * Applies accent card styling when the caller needs visual focus.
 * @param {boolean} [props.tight]
 * Applies compact card density for secondary project lists.
 */
function ProjectCard({ project, ctaCard = false, tight = false }) {
  const hasLiveUrl = Boolean(project.live_url);
  const repoLinks = getRepoLinks(project);
  const detailPath = buildRoute.projectDetail(getProjectSlug(project));

  return (
    <article className={getProjectCardClassName(ctaCard, tight)}>
      {project.featured && ctaCard && (
        <p className="project-card__badge">
          <i className="fa-regular fa-star" aria-hidden="true"></i>
          <span>Featured</span>
        </p>
      )}

      <h3 className="project-card__title">
        <Link to={detailPath}>{project.title}</Link>
      </h3>

      <div className="project-card__summary">{renderLinebreaks(project.summary)}</div>

      <ul className="project-card__tags" aria-label={`${project.title} technologies`}>
        <li className="project-card__tag">Project tech stack TBD</li>
      </ul>

      <div className="project-card__links">
        <Link className="cta-link" to={detailPath}>
          View project <span aria-hidden="true">-&gt;</span>
        </Link>

        <SocialMediaLinks links={repoLinks} linkClassName="project-card__link secondary" />

        {hasLiveUrl && (
          <a className="project-card__link primary" href={project.live_url} target="_blank" rel="noreferrer">
            <i className="fa-solid fa-display" aria-hidden="true"></i>
            <span>Live demo</span>
            <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
          </a>
        )}
      </div>
    </article>
  );
}

export default ProjectCard;
