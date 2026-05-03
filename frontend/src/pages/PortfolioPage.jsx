import { useEffect, useMemo, useState } from "react";
import { getProjects } from "../api/projectsApi";
import ProjectsSection from "../components/portfolio/ProjectsSection";
import { usePageTitle } from "../hooks/usePageTitle";

function PortfolioPage() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  usePageTitle("Portfolio");

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch((error) => {
        console.error(error);
        setError(error);
      });
  }, []);

  const { featuredProjects, otherProjects } = useMemo(() => {
    const visibleProjects = projects.filter((project) => project.publish !== false);
    const featured = visibleProjects.filter((project) => project.featured === true || project.highlighted === true);
    const other = visibleProjects.filter((project) => !featured.includes(project));

    return {
      featuredProjects: featured,
      otherProjects: other,
    };
  }, [projects]);

  return (
    <div className="portfolio-page">
      {error ? <p className="portfolio-page__empty">Could not load projects.</p> : null}

      <section className="portfolio-section" aria-labelledby="featured-projects-heading">
        <div className="portfolio-section__header">
          <h2 id="featured-projects-heading">Featured Projects</h2>
          <a className="section-link" href="#other-projects">
            View all featured <span aria-hidden="true">-&gt;</span>
          </a>
        </div>
        <ProjectsSection ctaCards={true} projects={featuredProjects} />
      </section>

      <section className="portfolio-section" aria-labelledby="other-projects-heading" id="other-projects">
        <div className="portfolio-section__header">
          <h2 id="other-projects-heading">Other Projects</h2>
          <a className="section-link" href="#other-projects">
            View all projects <span aria-hidden="true">-&gt;</span>
          </a>
        </div>

        <ProjectsSection projects={otherProjects} tight={true} />
      </section>
    </div>
  );
}

export default PortfolioPage;
