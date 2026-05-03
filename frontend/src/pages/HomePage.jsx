import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBlogPosts } from "../api/blogApi";
import { getProjects } from "../api/projectsApi";
import HeroSection from "../components/core/HeroSection";
import ProjectsSection from "../components/portfolio/ProjectsSection";
import { useFrontendContext } from "../context/useFrontendContext";
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
  const { contextData } = useFrontendContext();
  const [projects, setProjects] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [projectsError, setProjectsError] = useState(null);
  const [blogPostsError, setBlogPostsError] = useState(null);

  usePageTitle("");

  useEffect(() => {
    getProjects()
      .then(setProjects)
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

  const homeContent = contextData?.home ?? {};
  const headline = homeContent.headline || "Hero headline TBD";
  const intro = homeContent.intro || "Hero intro TBD";
  const skills = homeContent.skills?.length > 0 ? homeContent.skills : ["Skills TBD"];

  return (
    <div className="home-page">
      <HeroSection headline={headline} intro={intro} skills={skills} />

      <section className="home-section" aria-labelledby="home-projects-heading">
        <div className="home-section__header">
          <h2 id="home-projects-heading">Featured Projects</h2>
          <Link className="section-link" to={ROUTES.portfolio}>
            View all projects <span aria-hidden="true">-&gt;</span>
          </Link>
        </div>

        {projectsError ? (
          <p className="home-empty-state">Could not load projects.</p>
        ) : (
          <ProjectsSection projects={projects} />
        )}
      </section>

      <section className="home-section" aria-labelledby="home-writing-heading">
        <div className="home-section__header">
          <h2 id="home-writing-heading">Latest Writing</h2>
          <Link className="section-link" to={ROUTES.blog}>
            View all posts <span aria-hidden="true">-&gt;</span>
          </Link>
        </div>

        {blogPosts.length > 0 ? (
          <ul className="home-writing-list">
            {blogPosts.map((blogPost) => (
              <li className="home-writing-card card" key={blogPost.id ?? blogPost.slug}>
                <div className="home-writing-icon" aria-hidden="true">
                  <i className="fa-regular fa-file-lines"></i>
                </div>

                <div>
                  <h3>
                    <Link to={buildRoute.blogPostDetail(blogPost.slug)}>{blogPost.title}</Link>
                  </h3>
                  <p>{blogPost.intro}</p>
                </div>

                {formatDate(blogPost.date_added) && (
                  <time dateTime={blogPost.date_added}>{formatDate(blogPost.date_added)}</time>
                )}

                <Link className="section-link" to={buildRoute.blogPostDetail(blogPost.slug)}>
                  Read more <span aria-hidden="true">-&gt;</span>
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
