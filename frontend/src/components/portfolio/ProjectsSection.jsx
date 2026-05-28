import ProjectCard from "./ProjectCard";
import { buildRoute } from "../../routes/paths";
import OverviewCardSection from "../core/OverviewCardSection";
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

  return (
    <OverviewCardSection
      id={id}
      heading={heading}
      itemCount={projects.length}
      className="projects-section-block"
      listClassName="projects-section"
      itemClassName="projects-section__item"
      featured={featured}
      secondary={tight}
      linkHref={showAllLink ? linkHref : ""}
      linkText={showAllLink ? linkText : ""}
    >
      {projects.map((project) => (
        <ProjectCard project={project} icon={cardIcon} ctaCard={ctaCards} tight={tight} key={project.id ?? project.slug} />
      ))}
    </OverviewCardSection>
  );
}

export default ProjectsSection;
