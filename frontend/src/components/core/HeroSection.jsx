import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDocker, faJava, faLinux, faPostgresql, faPython } from "@fortawesome/free-brands-svg-icons";
import { faD, faLeaf, faTerminal } from "@fortawesome/free-solid-svg-icons";
import { renderLinebreaks } from "../../utils/renderLinebreaks";
import "./HeroSection.css";

const skillIcons = {
  Python: faPython,
  Django: faD,
  Java: faJava,
  "Spring Boot": faLeaf,
  PostgreSQL: faPostgresql,
  Docker: faDocker,
  Linux: faLinux,
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

/**
 * Render the shared page hero.
 *
 * @param {object} props
 * @param {string} props.headline
 * Primary hero heading.
 * @param {string} props.intro
 * Introductory body copy rendered below the heading.
 * @param {Array<string|object>} [props.skills]
 * Optional skills rendered as technology tags.
 * @param {import("react").ReactNode} [props.actions]
 * Optional action links rendered at the bottom of the hero copy.
 * @param {import("react").ReactNode} [props.visual]
 * Optional visual content rendered in the hero visual area.
 */
function HeroSection({ headline, intro, skills = [], actions = null, visual = null }) {
  const hasSkills = skills.length > 0;
  const hasActions = actions !== null;
  const hasCustomVisual = visual !== null;
  const visualContent = visual ?? <FontAwesomeIcon icon={faTerminal} />;

  return (
    <section className="hero-section panel">
      <div className="hero-section__content">
        <div className="hero-section__copy">
          <h1 className="hero-section__title">{headline}</h1>

          <div className="hero-section__intro">{renderLinebreaks(intro)}</div>
        </div>

        {(hasSkills || hasActions) && (
          <div className="hero-section__footer">
            {hasSkills && (
              <ul className="hero-section__skills" aria-label="Core technologies">
                {skills.map((skill) => {
                  const label = getSkillLabel(skill);

                  if (!label) {
                    return null;
                  }

                  return (
                    <li className="tag hero-section__skill" key={getSkillKey(skill)}>
                      {skillIcons[label] && <FontAwesomeIcon icon={skillIcons[label]} aria-hidden="true" />}
                      <span>{label}</span>
                    </li>
                  );
                })}
              </ul>
            )}

            {hasActions && <div className="hero-section__actions">{actions}</div>}
          </div>
        )}
      </div>

      <div className="hero-section__visual" aria-hidden={hasCustomVisual ? undefined : "true"}>
        <div className="hero-section__terminal">
          {visualContent}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
