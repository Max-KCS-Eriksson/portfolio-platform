import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faArrowUpRightFromSquare, faDisplay } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { getProject } from "../api/projectsApi";
import HeroSection from "../components/core/HeroSection";
import ProjectStatusBadge from "../components/portfolio/ProjectStatusBadge";
import { usePageTitle } from "../hooks/usePageTitle";
import { renderLinebreaks } from "../utils/renderLinebreaks";
import "./ProjectPage.css";

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

  const hasLiveUrl = Boolean(project.liveUrl);
  const hasThumbnail = Boolean(project.thumbnail);
  const hasStatusBadge = project.status === "beta" || project.status === "prototype";
  const techStack = project.techStack?.length > 0 ? project.techStack : ["Project tech stack TBD"];
  const sections = [
    { marker: "01", title: "Problem", body: project.problem },
    { marker: "02", title: "What I Built", body: project.solution },
    { marker: "03", title: "Technical Choices", body: project.techChoices },
    { marker: "04", title: "What This Demonstrates", body: project.competenciesDemonstrated },
  ];
  const heroActions = (
    <>
      <a className="project-detail__link" href={project.repoUrl} target="_blank" rel="noreferrer">
        <FontAwesomeIcon icon={faGithub} aria-hidden="true" />
        <span>GitHub</span>
        <FontAwesomeIcon icon={faArrowUpRightFromSquare} aria-hidden="true" />
      </a>

      {hasLiveUrl && (
        <a className="project-detail__link" href={project.liveUrl} target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon={faDisplay} aria-hidden="true" />
          <span>Live demo</span>
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} aria-hidden="true" />
        </a>
      )}
    </>
  );

  return (
    <article className="project-detail">
      <HeroSection
        headline={project.title}
        intro={project.description}
        skills={techStack}
        actions={heroActions}
        visual={
          hasThumbnail ? (
            <img
              className="project-detail__visual-media"
              src={project.thumbnail}
              alt={project.thumbnailCaption || `${project.title} thumbnail`}
            />
          ) : null
        }
      />

      <div className="project-detail__sections">
        {sections.map((section) => (
          <section
            className="project-detail__section card"
            key={section.marker}
            aria-labelledby={`project-section-${section.marker}`}
          >
            <h2 id={`project-section-${section.marker}`}>
              <span className="project-detail__section-marker">{section.marker}</span>
              <span className="project-detail__section-title">{section.title}</span>
              {hasStatusBadge && section.marker === "02" && (
                <ProjectStatusBadge status={project.status} className="project-detail__status-badge" />
              )}
            </h2>
            <div className="project-detail__section-body">{renderLinebreaks(section.body)}</div>
          </section>
        ))}
      </div>
    </article>
  );
}

export default ProjectPage;
