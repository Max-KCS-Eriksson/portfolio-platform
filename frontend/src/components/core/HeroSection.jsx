import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTerminal } from "@fortawesome/free-solid-svg-icons";
import { renderLinebreaks } from "../../utils/renderLinebreaks";
import "./HeroSection.css";

/**
 * Render the shared page hero.
 *
 * @param {object} props
 * @param {string} props.headline
 * Primary hero heading.
 * @param {import("react").ReactNode} [props.meta]
 * Optional metadata rendered directly under the heading and before the intro.
 * @param {string} props.intro
 * Introductory body copy rendered below the heading.
 * @param {Array<string>} [props.skills]
 * Optional skill labels rendered as technology tags.
 * @param {import("react").ReactNode} [props.actions]
 * Optional action links rendered at the bottom of the hero copy.
 * @param {import("react").ReactNode} [props.visual]
 * Optional visual content rendered in the hero visual area.
 */
function HeroSection({ headline, meta = null, intro, skills = [], actions = null, visual = null }) {
  const hasMeta = meta !== null;
  const hasSkills = skills.length > 0;
  const hasActions = actions !== null;
  const hasCustomVisual = visual !== null;
  const visualContent = visual ?? <FontAwesomeIcon icon={faTerminal} />;

  return (
    <section className="hero-section panel">
      <div className="hero-section__content">
        <div className="hero-section__copy">
          <h1 className="hero-section__title">{headline}</h1>

          {hasMeta && <div className="hero-section__meta">{meta}</div>}

          <div className="hero-section__intro section-text">{renderLinebreaks(intro)}</div>
        </div>

        {(hasSkills || hasActions) && (
          <div className="hero-section__footer">
            {hasSkills && (
              <ul className="hero-section__skills" aria-label="Core technologies">
                {skills.map((skill) => (
                  <li className="tag hero-section__skill" key={skill}>
                    {skill}
                  </li>
                ))}
              </ul>
            )}

            {hasActions && <div className="hero-section__actions">{actions}</div>}
          </div>
        )}
      </div>

      <div className="hero-section__visual" aria-hidden={hasCustomVisual ? undefined : "true"}>
        <div className="hero-section__terminal">{visualContent}</div>
      </div>
    </section>
  );
}

export default HeroSection;
