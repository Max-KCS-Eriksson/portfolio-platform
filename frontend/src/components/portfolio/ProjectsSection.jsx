import ProjectCard from "./ProjectCard";
import "./ProjectsSection.css";

function ProjectsSection({ projects }) {
  if (projects.length === 0) {
    return <p className="projects-section__empty">Projects TBD</p>;
  }

  return (
    <ul className="projects-section">
      {projects.map((project) => (
        <li className="projects-section__item" key={project.id ?? project.slug}>
          <ProjectCard project={project} />
        </li>
      ))}
    </ul>
  );
}

export default ProjectsSection;
