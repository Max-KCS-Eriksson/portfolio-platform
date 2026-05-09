import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from "@fortawesome/free-regular-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { getBlogPosts } from "../api/blogApi";
import { getHero } from "../api/coreApi";
import { getProjectsByFeatured } from "../api/projectsApi";
import HeroSection from "../components/core/HeroSection";
import SocialMediaLinks from "../components/layout/SocialMediaLinks";
import ProjectsSection from "../components/portfolio/ProjectsSection";
import { getBlogOverviewLimit, getProjectOverviewLimit, limitOverviewItems } from "../config/overviewLimits";
import { useContextData } from "../context/useContextData";
import { usePageTitle } from "../hooks/usePageTitle";
import { buildRoute, ROUTES } from "../routes/paths";
import "./HomePage.css";

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return dateFormatter.format(date);
}

function HomePage() {
  const { contextData } = useContextData();
  const [heroContent, setHeroContent] = useState({});
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [projectsError, setProjectsError] = useState(null);
  const [blogPostsError, setBlogPostsError] = useState(null);

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

    getBlogPosts()
      .then(setBlogPosts)
      .catch((error) => {
        console.error(error);
        setBlogPostsError(error);
      });
  }, []);

  const headline = heroContent.headline || "Hero headline TBD";
  const intro = heroContent.intro || "Hero intro TBD";
  const skills = heroContent.skills?.length > 0 ? heroContent.skills : ["Skills TBD"];
  const overviewFeaturedProjects = limitOverviewItems(featuredProjects, getProjectOverviewLimit(contextData));
  const overviewBlogPosts = limitOverviewItems(blogPosts, getBlogOverviewLimit(contextData));
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
        <ProjectsSection projects={overviewFeaturedProjects} />
      ) : null}

      <section className="home-section" aria-labelledby="home-writing-heading">
        <div className="home-section__header">
          <h2 id="home-writing-heading">Latest Writing</h2>
          <Link className="section-link" to={ROUTES.blog}>
            <span>View all posts</span>
            <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
          </Link>
        </div>

        {overviewBlogPosts.length > 0 ? (
          <ul className="home-writing-list">
            {overviewBlogPosts.map((blogPost) => (
              <li className="home-writing-card card" key={blogPost.id ?? blogPost.slug}>
                <div className="home-writing-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faFileLines} />
                </div>

                <div>
                  <h3>
                    <Link to={buildRoute.blogPostDetail(blogPost.slug)}>{blogPost.title}</Link>
                  </h3>
                  <p>{blogPost.intro}</p>
                </div>

                {formatDate(blogPost.dateAdded) && (
                  <time dateTime={blogPost.dateAdded}>{formatDate(blogPost.dateAdded)}</time>
                )}

                <Link className="section-link" to={buildRoute.blogPostDetail(blogPost.slug)}>
                  <span>Read more</span>
                  <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="home-empty-state">{blogPostsError ? "Could not load writing." : "Writing is loading."}</p>
        )}
      </section>
    </div>
  );
}

export default HomePage;
