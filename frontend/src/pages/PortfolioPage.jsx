import { useEffect, useState } from "react";
import { getPortfolioContext, getProjectsByFeatured } from "../api/projectsApi";
import HeroSection from "../components/core/HeroSection";
import ProjectsSection from "../components/portfolio/ProjectsSection";
import { getProjectOverviewLimit, limitOverviewItems } from "../config/overviewLimits";
import { useContextData } from "../context/useContextData";
import { usePageTitle } from "../hooks/usePageTitle";
import "./PortfolioPage.css";

function PortfolioPage() {
  const { contextData } = useContextData();
  const [portfolioContext, setPortfolioContext] = useState(null);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [otherProjects, setOtherProjects] = useState([]);
  const [error, setError] = useState(null);

  usePageTitle("Portfolio");

  useEffect(() => {
    Promise.all([getPortfolioContext(), getProjectsByFeatured(true), getProjectsByFeatured(false)])
      .then(([portfolioContext, featuredProjects, otherProjects]) => {
        setPortfolioContext(portfolioContext);
        setFeaturedProjects(featuredProjects);
        setOtherProjects(otherProjects);
      })
      .catch((error) => {
        console.error(error);
        setError(error);
      });
  }, []);

  const projectOverviewLimit = getProjectOverviewLimit(contextData);
  const overviewFeaturedProjects = limitOverviewItems(featuredProjects, projectOverviewLimit);
  const overviewOtherProjects = limitOverviewItems(otherProjects, projectOverviewLimit);
  const intro = portfolioContext?.intro || "Portfolio intro TBD";

  return (
    <div className="portfolio-page">
      <HeroSection headline="Portfolio" intro={intro} />

      {error ? <p className="portfolio-page__empty">Could not load projects.</p> : null}

      {overviewFeaturedProjects.length > 0 && (
        <ProjectsSection projects={overviewFeaturedProjects} cardIcon={true} ctaCards={true} />
      )}

      {overviewOtherProjects.length > 0 && (
        <ProjectsSection projects={overviewOtherProjects} cardIcon={true} tight={true} />
      )}
    </div>
  );
}

export default PortfolioPage;
