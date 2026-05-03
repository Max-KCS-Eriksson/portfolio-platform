import { useEffect, useMemo, useState } from "react";
import { getProjects } from "../api/projectsApi";
import HeroSection from "../components/core/HeroSection";
import ProjectsSection from "../components/portfolio/ProjectsSection";
import { usePageTitle } from "../hooks/usePageTitle";
import "./PortfolioPage.css";

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
    const featured = projects.filter((project) => project.featured === true || project.highlighted === true);
    const other = projects.filter((project) => !featured.includes(project));

    return {
      featuredProjects: featured,
      otherProjects: other,
    };
  }, [projects]);

  return (
    <div className="portfolio-page">
      <HeroSection headline="Portfolio" intro="Portfolio intro TBD" />

      {error ? <p className="portfolio-page__empty">Could not load projects.</p> : null}

      {featuredProjects.length > 0 && <ProjectsSection projects={featuredProjects} cardIcon={true} ctaCards={true} />}

      {otherProjects.length > 0 && <ProjectsSection projects={otherProjects} cardIcon={true} tight={true} />}
    </div>
  );
}

export default PortfolioPage;
