import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { getHero } from "../api/coreApi";
import { getProjectsByFeatured } from "../api/projectsApi";
import HeroSection from "../components/core/HeroSection";
import SocialMediaLinks from "../components/layout/SocialMediaLinks";
import ProjectsSection from "../components/portfolio/ProjectsSection";
import { getFeaturedProjectOverviewLimit, limitOverviewItems } from "../config/overviewLimits";
import { usePageTitle } from "../hooks/usePageTitle";
import { ROUTES } from "../routes/paths";
import "./HomePage.css";

function HomePage() {
  const [heroContent, setHeroContent] = useState({});
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [projectsError, setProjectsError] = useState(null);

  usePageTitle("");

  useEffect(() => {
    getHero()
      .then(setHeroContent)
      .catch((error) => {
        console.error(error);
        setHeroContent({});
      });

    getProjectsByFeatured(true)
      .then(setFeaturedProjects)
      .catch((error) => {
        console.error(error);
        setProjectsError(error);
      });
  }, []);

  const headline = heroContent.headline || "Hero headline TBD";
  const intro = heroContent.intro || "Hero intro TBD";
  const skills = heroContent.skills?.length > 0 ? heroContent.skills : ["Skills TBD"];
  const overviewFeaturedProjects = limitOverviewItems(featuredProjects, getFeaturedProjectOverviewLimit());
  const showFeaturedProjectsLink = featuredProjects.length > getFeaturedProjectOverviewLimit();
  const heroActions = (
    <>
      <Link className="cta cta-button" to={ROUTES.portfolio}>
        <span>View Portfolio</span>
        <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
      </Link>
      <Link className="cta cta-button secondary" to={ROUTES.about}>
        About Me
      </Link>

      <SocialMediaLinks />
    </>
  );

  return (
    <div className="home-page">
      <HeroSection headline={headline} intro={intro} skills={skills} actions={heroActions} />

      {projectsError ? <p className="home-empty-state">Could not load projects.</p> : null}

      {!projectsError && overviewFeaturedProjects.length > 0 ? (
        <ProjectsSection projects={overviewFeaturedProjects} showAllLink={showFeaturedProjectsLink} />
      ) : null}
    </div>
  );
}

export default HomePage;
