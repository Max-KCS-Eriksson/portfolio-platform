import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSeedling, faTerminal } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { getAbout } from "../api/coreApi";
import HeroSection from "../components/core/HeroSection";
import NumberedHeading from "../components/core/NumberedHeading";
import SocialMediaLinks from "../components/layout/SocialMediaLinks";
import { usePageTitle } from "../hooks/usePageTitle";
import { renderLinebreaks } from "../utils/renderLinebreaks";
import "./AboutPage.css";

function AboutPage() {
  const [about, setAbout] = useState(null);
  const [error, setError] = useState(null);

  usePageTitle("About");

  useEffect(() => {
    getAbout()
      .then(setAbout)
      .catch((error) => {
        console.error(error);
        setError(error);
      });
  }, []);

  const intro = about?.intro || "About intro TBD";
  const hasBackground = Boolean(about?.background);
  const hasMindsetIntro = Boolean(about?.mindsetIntro);
  const hasMindsetList = about?.mindsetList?.length > 0;
  const hasFocusIntro = Boolean(about?.focusIntro);
  const hasFocusList = about?.focusList?.length > 0;
  const hasFocus = hasFocusIntro || hasFocusList;
  const heroActions = <SocialMediaLinks />;

  return (
    <div className="about-page">
      <HeroSection headline="About" intro={intro} actions={heroActions} />

      {error && <p className="description">Could not load about content.</p>}

      <div className="about-page__sections">
        {hasBackground && (
          <section className="card about-section wide" aria-labelledby="about-background-heading">
            <div className="about-section__icon card-icon" aria-hidden="true">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <div className="about-section__content">
              <NumberedHeading id="about-background-heading" marker="01">
                Background
              </NumberedHeading>
              <div className="about-section__body section-text">{renderLinebreaks(about.background)}</div>
            </div>
          </section>
        )}

        {(hasMindsetIntro || hasMindsetList) && (
          <section
            className={`card about-section ${hasFocus ? "" : "wide"}`}
            aria-labelledby="about-work-heading"
          >
            <div className="about-section__icon card-icon" aria-hidden="true">
              <FontAwesomeIcon icon={faTerminal} />
            </div>
            <div className="about-section__content">
              <NumberedHeading id="about-work-heading" marker="02">
                How I Work
              </NumberedHeading>
              {hasMindsetIntro && <div className="about-section__body section-text">{renderLinebreaks(about.mindsetIntro)}</div>}
              {hasMindsetList && (
                <ul className="about-page__habit-list section-text">
                  {about.mindsetList.map((mindsetListItem) => (
                    <li key={mindsetListItem}>{mindsetListItem}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {hasFocus && (
          <section className="card about-section" aria-labelledby="about-focus-heading">
            <div className="about-section__icon card-icon" aria-hidden="true">
              <FontAwesomeIcon icon={faSeedling} />
            </div>
            <div className="about-section__content">
              <NumberedHeading id="about-focus-heading" marker="03">
                Current Focus
              </NumberedHeading>
              {hasFocusIntro && <div className="about-section__body section-text">{renderLinebreaks(about.focusIntro)}</div>}
              {hasFocusList && (
                <ul className="about-page__habit-list section-text">
                  {about.focusList.map((focusListItem) => (
                    <li key={focusListItem}>{focusListItem}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default AboutPage;
