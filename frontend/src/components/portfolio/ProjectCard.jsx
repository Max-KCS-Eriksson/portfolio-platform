import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import { faArrowRight, faArrowUpRightFromSquare, faCode, faDisplay } from "@fortawesome/free-solid-svg-icons";
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
 * @param {boolean} [props.icon]
 * Renders the default project card icon.
 * @param {boolean} [props.tight]
 * Applies compact card density for secondary project lists.
 */
function ProjectCard({ project, icon = false, ctaCard = false, tight = false }) {
  const hasLiveUrl = Boolean(project.live_url);
  const repoLinks = getRepoLinks(project);
  const detailPath = buildRoute.projectDetail(getProjectSlug(project));

  return (
    <article className={getProjectCardClassName(ctaCard, tight)}>
      {icon && (
        <div className="project-card__icon" aria-hidden="true">
          <FontAwesomeIcon icon={faCode} />
        </div>
      )}

      {project.featured && ctaCard && (
        <p className="project-card__badge">
          <FontAwesomeIcon icon={faStar} aria-hidden="true" />
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
          <span>View project</span>
          <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
        </Link>

        <SocialMediaLinks links={repoLinks} linkClassName="project-card__link secondary" />

        {hasLiveUrl && (
          <a className="project-card__link primary" href={project.live_url} target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={faDisplay} aria-hidden="true" />
            <span>Live demo</span>
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  );
}

export default ProjectCard;
