import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCode } from "@fortawesome/free-regular-svg-icons";
import { faArrowRight, faArrowUpRightFromSquare, faDisplay } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import SocialMediaLinks from "../layout/SocialMediaLinks";
import { buildRoute } from "../../routes/paths";
import { renderLinebreaks } from "../../utils/renderLinebreaks";
import ProjectStatusBadge from "./ProjectStatusBadge";
import "./ProjectCard.css";

function getProjectCardClassName(ctaCard, tight) {
  return ["card project-summary", ctaCard ? "cta-card" : "", tight ? "compact" : ""].filter(Boolean).join(" ");
}

function getRepoLinks(project) {
  return [{ id: `${project.id ?? project.slug}-repo`, socialMedia: "gh", url: project.repoUrl }];
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
 * Renders the project card image, or a default icon when the project has no icon URL.
 * @param {boolean} [props.tight]
 * Applies compact card density for secondary project lists.
 */
function ProjectCard({ project, icon = false, ctaCard = false, tight = false }) {
  const hasLiveUrl = Boolean(project.liveUrl);
  const repoLinks = getRepoLinks(project);
  const detailPath = buildRoute.projectDetail(project.slug);
  const titleId = `project-summary-title-${project.id ?? project.slug}`;
  const techStack = project.techStack?.length > 0 ? project.techStack : ["Project tech stack TBD"];
  const hasStatusBadge = project.status === "beta" || project.status === "prototype";
  const hasFeaturedBadge = project.featured && ctaCard;

  return (
    <article className={getProjectCardClassName(ctaCard, tight)}>
      <Link className="project-summary__overlay-link" to={detailPath} aria-labelledby={titleId} />

      <div className="project-summary__header">
        <div className="project-summary__identity">
          {icon && (
            <div className="project-summary__icon card-icon" aria-hidden="true">
              {project.icon ? <img src={project.icon} alt="" /> : <FontAwesomeIcon icon={faFileCode} />}
            </div>
          )}

          <h3 className="project-summary__title text-default" id={titleId}>
            {project.title}
          </h3>
        </div>

        {(hasStatusBadge || hasFeaturedBadge) && (
          <div className="project-summary__badges" aria-label={`${project.title} status`}>
            {hasStatusBadge && <ProjectStatusBadge status={project.status} />}
            {hasFeaturedBadge && <ProjectStatusBadge featured={true} />}
          </div>
        )}
      </div>

      <div className="project-summary__description card-text">{renderLinebreaks(project.description)}</div>

      <ul className="project-summary__tags" aria-label={`${project.title} technologies`}>
        {techStack.map((tech) => (
          <li className="project-summary__tag text-soft" key={tech}>
            {tech}
          </li>
        ))}
      </ul>

      <div className="project-summary__links">
        <span className="project-summary__link detail">
          <span>View project</span>
          <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
        </span>

        <SocialMediaLinks links={repoLinks} linkClassName="project-summary__link secondary text-muted" />

        {hasLiveUrl && (
          <a
            className="project-summary__link primary text-soft"
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
          >
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
