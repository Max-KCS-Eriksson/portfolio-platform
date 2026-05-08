import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCode, faStar } from "@fortawesome/free-regular-svg-icons";
import { faArrowRight, faArrowUpRightFromSquare, faDisplay } from "@fortawesome/free-solid-svg-icons";
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

  return [{ id: `${project.id ?? slug}-repo`, socialMedia: "gh", url: project.repoUrl }];
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
  const hasLiveUrl = Boolean(project.liveUrl);
  const repoLinks = getRepoLinks(project);
  const detailPath = buildRoute.projectDetail(getProjectSlug(project));
  const titleId = `project-card-title-${project.id ?? getProjectSlug(project)}`;
  const techStack = project.techStack?.length > 0 ? project.techStack : ["Project tech stack TBD"];

  return (
    <article className={getProjectCardClassName(ctaCard, tight)}>
      <Link className="project-card__overlay-link" to={detailPath} aria-labelledby={titleId} />

      {icon && (
        <div className="project-card__icon" aria-hidden="true">
          <FontAwesomeIcon icon={faFileCode} />
        </div>
      )}

      {project.featured && ctaCard && (
        <p className="project-card__badge">
          <FontAwesomeIcon icon={faStar} aria-hidden="true" />
          <span>Featured</span>
        </p>
      )}

      <h3 className="project-card__title" id={titleId}>
        {project.title}
      </h3>

      <div className="project-card__summary">{renderLinebreaks(project.summary)}</div>

      <ul className="project-card__tags" aria-label={`${project.title} technologies`}>
        {techStack.map((tech) => (
          <li className="project-card__tag" key={tech}>
            {tech}
          </li>
        ))}
      </ul>

      <div className="project-card__links">
        <span className="project-card__link detail">
          <span>View project</span>
          <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
        </span>

        <SocialMediaLinks links={repoLinks} linkClassName="project-card__link secondary" />

        {hasLiveUrl && (
          <a className="project-card__link primary" href={project.liveUrl} target="_blank" rel="noreferrer">
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
