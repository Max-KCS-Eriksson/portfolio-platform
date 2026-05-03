import ProjectCard from "./ProjectCard";
import "./ProjectsSection.css";

function getProjectsSectionConfig(projects) {
  const featured = projects[0]?.featured === true || projects[0]?.highlighted === true;

  if (featured) {
    return {
      id: "featured-projects",
      heading: "Featured Projects",
      linkHref: "#featured-projects",
      linkText: "View all featured",
    };
  }

  return {
    id: "other-projects",
    heading: "Other Projects",
    linkHref: "#other-projects",
    linkText: "View all projects",
  };
}

function getProjectsSectionClassName(tight) {
  return ["projects-section", tight ? "secondary" : ""].filter(Boolean).join(" ");
}

/**
 * Render a list of project cards.
 *
 * @param {object} props
 * @param {Array<object>} props.projects
 * Non-empty project data rendered as a titled card section.
 * @param {boolean} [props.ctaCards]
 * Applies CTA card styling to every rendered project card.
 * @param {boolean} [props.tight]
 * Applies compact grid density for secondary project lists.
 */
function ProjectsSection({ projects, ctaCards = false, tight = false }) {
  const { id, heading, linkHref, linkText } = getProjectsSectionConfig(projects);
  const headingId = `${id}-heading`;

  return (
    <section className="projects-section-block" aria-labelledby={headingId} id={id}>
      <div className="projects-section-block__header">
        <h2 id={headingId}>{heading}</h2>
        <a className="projects-section-block__link" href={linkHref}>
          {linkText} <span aria-hidden="true">-&gt;</span>
        </a>
      </div>

      <ul className={getProjectsSectionClassName(tight)}>
        {projects.map((project) => (
          <li className="projects-section__item" key={project.id ?? project.slug}>
            <ProjectCard ctaCard={ctaCards} project={project} tight={tight} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ProjectsSection;
