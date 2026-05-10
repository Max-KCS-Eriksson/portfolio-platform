import { useEffect, useState } from "react";
import { getPortfolioContext, getProjectsByFeatured } from "../api/projectsApi";
import HeroSection from "../components/core/HeroSection";
import ProjectsSection from "../components/portfolio/ProjectsSection";
import {
  getFeaturedProjectOverviewLimit,
  getOtherProjectOverviewLimit,
  limitOverviewItems,
} from "../config/overviewLimits";
import { usePageTitle } from "../hooks/usePageTitle";
import "./PortfolioPage.css";

/**
 * Render the portfolio overview or a full project listing.
 *
 * @param {object} props
 * @param {boolean} [props.featured]
 * When true, renders all featured projects. When false, renders all non-featured projects.
 * When omitted, renders the default portfolio overview.
 */
function PortfolioPage({ featured = undefined }) {
  const [portfolioContext, setPortfolioContext] = useState(null);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [otherProjects, setOtherProjects] = useState([]);
  const [error, setError] = useState(null);

  const isFeaturedListing = featured === true;
  const isOtherListing = featured === false;
  const isOverview = featured === undefined;
  const pageTitle = isFeaturedListing ? "Featured Projects" : "Portfolio";

  usePageTitle(pageTitle);

  useEffect(() => {
    setFeaturedProjects([]);
    setOtherProjects([]);
    setError(null);

    if (isFeaturedListing) {
      Promise.all([getPortfolioContext(), getProjectsByFeatured(true)])
        .then(([portfolioContext, featuredProjects]) => {
          setPortfolioContext(portfolioContext);
          setFeaturedProjects(featuredProjects);
        })
        .catch((error) => {
          console.error(error);
          setError(error);
        });
      return;
    }

    if (isOtherListing) {
      Promise.all([getPortfolioContext(), getProjectsByFeatured(false)])
        .then(([portfolioContext, otherProjects]) => {
          setPortfolioContext(portfolioContext);
          setOtherProjects(otherProjects);
        })
        .catch((error) => {
          console.error(error);
          setError(error);
        });
      return;
    }

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
  }, [isFeaturedListing, isOtherListing]);

  const featuredProjectOverviewLimit = getFeaturedProjectOverviewLimit();
  const otherProjectOverviewLimit = getOtherProjectOverviewLimit();
  const overviewFeaturedProjects = isOverview
    ? limitOverviewItems(featuredProjects, featuredProjectOverviewLimit)
    : featuredProjects;
  const overviewOtherProjects = isOverview
    ? limitOverviewItems(otherProjects, otherProjectOverviewLimit)
    : otherProjects;
  const showFeaturedProjectsLink = isOverview && featuredProjects.length > featuredProjectOverviewLimit;
  const showOtherProjectsLink = isOverview && otherProjects.length > otherProjectOverviewLimit;
  const intro = portfolioContext?.intro || "Portfolio intro TBD";

  return (
    <div className="portfolio-page">
      <HeroSection headline="Portfolio" intro={intro} />

      {error ? <p className="portfolio-page__empty">Could not load projects.</p> : null}

      {overviewFeaturedProjects.length > 0 && (
        <ProjectsSection
          projects={overviewFeaturedProjects}
          cardIcon={true}
          ctaCards={true}
          showAllLink={showFeaturedProjectsLink}
        />
      )}

      {overviewOtherProjects.length > 0 && (
        <ProjectsSection
          projects={overviewOtherProjects}
          cardIcon={true}
          tight={true}
          showAllLink={showOtherProjectsLink}
        />
      )}
    </div>
  );
}

export default PortfolioPage;
