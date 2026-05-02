import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProject } from "../api/projectsApi";
import { usePageTitle } from "../hooks/usePageTitle";
import { renderLinebreaks } from "../utils/renderLinebreaks";

function ProjectDetailPage() {
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

  const hasLiveUrl = project.live_url !== "";

  return (
    <>
      <h1 className="title">
        {hasLiveUrl ? <a href={project.live_url}>{project.title}</a> : project.title}
      </h1>

      <div className="summary">{renderLinebreaks(project.summary)}</div>

      <ul className="project-links">
        <li className="project-links-item">
          <a className="project-link" href={project.repo_url} aria-label={`${project.title} repository`}>
            <i className="fa-brands fa-github"></i>
          </a>
        </li>

        {hasLiveUrl && (
          <li className="project-links-item">
            <a className="project-link" href={project.live_url} aria-label={`${project.title} live site`}>
              <i className="fa-solid fa-globe"></i>
            </a>
          </li>
        )}
      </ul>

      <div className="description">{renderLinebreaks(project.description)}</div>
    </>
  );
}

export default ProjectDetailPage;
