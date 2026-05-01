import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProjects } from "../api/projectsApi";
import { usePageTitle } from "../hooks/usePageTitle";

function ProjectListPage() {
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

  if (error) {
    return (
      <div className="main-menu">
        <h1 className="title">Projects</h1>
        <p className="description">Could not load projects.</p>
      </div>
    );
  }

  return (
    <div className="main-menu">
      {projects.length > 0 ? (
        <ul>
          {projects.map((project) => (
            <li className="nav-item" key={project.id ?? project.slug}>
              <h2>
                <Link className="nav-link" to={`/portfolio/${project.slug}/`}>
                  {project.title}
                  <span className="path">/</span>
                </Link>
              </h2>

              <div className="summary">
                {project.summary?.split("\n").map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <>
          <h1 className="title">Projects</h1>
          <p className="description">Coming soon</p>
        </>
      )}
    </div>
  );
}

export default ProjectListPage;
