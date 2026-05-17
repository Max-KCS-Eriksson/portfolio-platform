import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import ProjectCard from "./ProjectCard";
import { buildRoute } from "../../routes/paths";
import { getProjectOverviewLayoutGroupSize } from "../../config/overviewLimits";
import "./ProjectsSection.css";

function getProjectsSectionConfig(projects) {
  const featured = projects[0]?.featured === true || projects[0]?.highlighted === true;

  if (featured) {
    return {
      featured,
      id: "featured-projects",
      heading: "Featured Projects",
      linkHref: buildRoute.portfolioFeatured(),
      linkText: "View all featured",
    };
  }

  return {
    featured,
    id: "other-projects",
    heading: "Other Projects",
    linkHref: buildRoute.portfolioProjects(),
    linkText: "View all projects",
  };
}

function getProjectsSectionClassName(tight, projectCount, featured) {
  const layoutGroupSize = getProjectOverviewLayoutGroupSize();
  const usesFeaturedSingleLayout = featured && projectCount === 1;
  const usesFeaturedPairedLayout = featured && projectCount === 2;
  const usesFeaturedLeadLayout = featured && projectCount === layoutGroupSize;
  const usesOtherPairedLayout = !featured && projectCount % 2 === 0 && projectCount % layoutGroupSize !== 0;
  const usesOtherFifthsLayout = !featured && projectCount % 5 === 0 && projectCount % 2 !== 0;
  const usesStackLayout = projectCount < layoutGroupSize;

  return [
    "projects-section",
    tight ? "secondary" : "",
    usesFeaturedSingleLayout ? "projects-section--layout-single" : "",
    usesFeaturedPairedLayout || usesOtherPairedLayout ? "projects-section--layout-paired" : "",
    usesFeaturedLeadLayout ? "projects-section--layout-lead" : "",
    usesOtherFifthsLayout ? "projects-section--layout-fifths" : "",
    usesStackLayout ? "projects-section--layout-stack" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * Render a list of project cards.
 *
 * @param {object} props
 * @param {Array<object>} props.projects
 * Non-empty project data rendered as a titled card section.
 * @param {boolean} [props.ctaCards]
 * Applies CTA card styling to every rendered project card.
 * @param {boolean} [props.cardIcon]
 * Enables project card icon rendering when project icon URLs are available.
 * @param {boolean} [props.tight]
 * Applies compact grid density for secondary project lists.
 * @param {boolean} [props.showAllLink]
 * Renders the route link to the full listing for the current section type.
 */
function ProjectsSection({ projects, cardIcon = false, ctaCards = false, tight = false, showAllLink = false }) {
  const { featured, id, heading, linkHref, linkText } = getProjectsSectionConfig(projects);
  const headingId = `${id}-heading`;

  return (
    <section className="projects-section-block" aria-labelledby={headingId} id={id}>
      <div className="projects-section-block__header">
        <h2 id={headingId}>{heading}</h2>
        {showAllLink && (
          <Link className="projects-section-block__link" to={linkHref}>
            <span>{linkText}</span>
            <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
          </Link>
        )}
      </div>

      <ul className={getProjectsSectionClassName(tight, projects.length, featured)}>
        {projects.map((project) => (
          <li className="projects-section__item" key={project.id ?? project.slug}>
            <ProjectCard project={project} icon={cardIcon} ctaCard={ctaCards} tight={tight} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ProjectsSection;
