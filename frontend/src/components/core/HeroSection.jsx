import { Link } from "react-router-dom";
import SocialMediaLinks from "../layout/SocialMediaLinks";
import { ROUTES } from "../../routes/paths";
import { renderLinebreaks } from "../../utils/renderLinebreaks";
import "./HeroSection.css";

const skillIcons = {
  Python: "fa-brands fa-python",
  Django: "fa-solid fa-d",
  Java: "fa-brands fa-java",
  "Spring Boot": "fa-solid fa-leaf",
  PostgreSQL: "fa-brands fa-postgresql",
  Docker: "fa-brands fa-docker",
  Linux: "fa-brands fa-linux",
};

function getSkillLabel(skill) {
  if (typeof skill === "string") {
    return skill;
  }

  return skill.name ?? skill.title ?? "";
}

function getSkillKey(skill) {
  if (typeof skill === "string") {
    return skill;
  }

  return skill.id ?? skill.slug ?? getSkillLabel(skill);
}

function HeroSection({ headline, intro, skills }) {
  return (
    <section className="home-hero panel">
      <div className="home-hero__content">
        <h1 className="home-hero__title">{headline}</h1>

        <div className="home-hero__intro">{renderLinebreaks(intro)}</div>

        <ul className="home-skills" aria-label="Core technologies">
          {skills.map((skill) => {
            const label = getSkillLabel(skill);

            if (!label) {
              return null;
            }

            return (
              <li className="tag home-skill" key={getSkillKey(skill)}>
                {skillIcons[label] && <i className={skillIcons[label]} aria-hidden="true"></i>}
                <span>{label}</span>
              </li>
            );
          })}
        </ul>

        <div className="home-actions">
          <Link className="cta-link" to={ROUTES.portfolio}>
            View Portfolio<span aria-hidden="true">-&gt;</span>
          </Link>
          <Link className="cta-link secondary" to={ROUTES.about}>
            About Me
          </Link>

          <SocialMediaLinks />
        </div>
      </div>

      <div className="home-hero__visual" aria-hidden="true">
        <div className="terminal-mark">
          <i className="fa-solid fa-terminal"></i>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
