import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSeedling, faTerminal } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { getAbout } from "../api/coreApi";
import HeroSection from "../components/core/HeroSection";
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
  const heroActions = <SocialMediaLinks linkClassName="about-page__social-link" />;

  return (
    <div className="about-page">
      <HeroSection headline="About" intro={intro} actions={heroActions} />

      {error && <p className="description">Could not load about content.</p>}

      <div className="about-page__cards">
        {hasBackground && (
          <section className="about-page__card about-page__card--wide card" aria-labelledby="about-background-heading">
            <div className="about-page__card-icon" aria-hidden="true">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <div className="about-page__card-content">
              <h2 id="about-background-heading">1. Background</h2>
              <div className="about-page__card-body">{renderLinebreaks(about.background)}</div>
            </div>
          </section>
        )}

        {(hasMindsetIntro || hasMindsetList) && (
          <section
            className={`about-page__card ${hasFocus ? "" : "about-page__card--wide"} card`}
            aria-labelledby="about-work-heading"
          >
            <div className="about-page__card-icon" aria-hidden="true">
              <FontAwesomeIcon icon={faTerminal} />
            </div>
            <div className="about-page__card-content">
              <h2 id="about-work-heading">2. How I Work</h2>
              {hasMindsetIntro && <div className="about-page__card-body">{renderLinebreaks(about.mindsetIntro)}</div>}
              {hasMindsetList && (
                <ul className="about-page__habit-list">
                  {about.mindsetList.map((mindsetListItem) => (
                    <li key={mindsetListItem}>{mindsetListItem}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {hasFocus && (
          <section className="about-page__card card" aria-labelledby="about-focus-heading">
            <div className="about-page__card-icon" aria-hidden="true">
              <FontAwesomeIcon icon={faSeedling} />
            </div>
            <div className="about-page__card-content">
              <h2 id="about-focus-heading">3. Current Focus</h2>
              {hasFocusIntro && <div className="about-page__card-body">{renderLinebreaks(about.focusIntro)}</div>}
              {hasFocusList && (
                <ul className="about-page__habit-list">
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
