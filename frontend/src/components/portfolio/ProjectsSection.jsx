import ProjectCard from "./ProjectCard";
import "./ProjectsSection.css";

function getProjectsSectionClassName(tight) {
  return ["projects-section", tight ? "secondary" : ""].filter(Boolean).join(" ");
}

/**
 * Render a list of project cards.
 *
 * @param {object} props
 * @param {Array<object>} props.projects
 * Project data rendered as cards.
 * @param {boolean} [props.ctaCards]
 * Applies CTA card styling to every rendered project card.
 * @param {boolean} [props.tight]
 * Applies compact grid density for secondary project lists.
 */
function ProjectsSection({ projects, ctaCards = false, tight = false }) {
  if (projects.length === 0) {
    return <p className="projects-section__empty">Projects TBD</p>;
  }

  return (
    <ul className={getProjectsSectionClassName(tight)}>
      {projects.map((project) => (
        <li className="projects-section__item" key={project.id ?? project.slug}>
          <ProjectCard ctaCard={ctaCards} project={project} tight={tight} />
        </li>
      ))}
    </ul>
  );
}

export default ProjectsSection;
