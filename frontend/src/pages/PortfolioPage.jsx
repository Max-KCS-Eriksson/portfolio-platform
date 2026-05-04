import { useEffect, useState } from "react";
import { getProjectsByFeatured } from "../api/projectsApi";
import HeroSection from "../components/core/HeroSection";
import ProjectsSection from "../components/portfolio/ProjectsSection";
import { usePageTitle } from "../hooks/usePageTitle";
import "./PortfolioPage.css";

function PortfolioPage() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [otherProjects, setOtherProjects] = useState([]);
  const [error, setError] = useState(null);

  usePageTitle("Portfolio");

  useEffect(() => {
    Promise.all([getProjectsByFeatured(true), getProjectsByFeatured(false)])
      .then(([featuredProjects, otherProjects]) => {
        setFeaturedProjects(featuredProjects);
        setOtherProjects(otherProjects);
      })
      .catch((error) => {
        console.error(error);
        setError(error);
      });
  }, []);

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
