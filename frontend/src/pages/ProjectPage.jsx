import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { getProject } from "../api/projectsApi";
import { usePageTitle } from "../hooks/usePageTitle";
import { renderLinebreaks } from "../utils/renderLinebreaks";

function ProjectPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);

  usePageTitle(project?.title ?? "Portfolio");

  useEffect(() => {
    setProject(null);
    setError(null);

    getProject(slug)
      .then(setProject)
      .catch((error) => {
        console.error(error);
        setError(error);
      });
  }, [slug]);

  if (error) {
    return (
      <>
        <h1 className="title">Project</h1>
        <p className="description">Could not load project.</p>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <h1 className="title">Project</h1>
        <p className="description">Loading...</p>
      </>
    );
  }

  const hasLiveUrl = project.liveUrl !== "";

  return (
    <>
      <h1 className="title">{hasLiveUrl ? <a href={project.liveUrl}>{project.title}</a> : project.title}</h1>

      <div className="summary">{renderLinebreaks(project.summary)}</div>

      <ul className="project-links">
        <li className="project-links-item">
          <a className="project-link" href={project.repoUrl} aria-label={`${project.title} repository`}>
            <FontAwesomeIcon icon={faGithub} aria-hidden="true" />
          </a>
        </li>

        {hasLiveUrl && (
          <li className="project-links-item">
            <a className="project-link" href={project.liveUrl} aria-label={`${project.title} live site`}>
              <FontAwesomeIcon icon={faGlobe} aria-hidden="true" />
            </a>
          </li>
        )}
      </ul>

      <div className="description">{renderLinebreaks(project.description)}</div>
    </>
  );
}

export default ProjectPage;
