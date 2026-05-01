import { useEffect, useState } from "react";
import { getAboutPage } from "../api/coreApi";
import SocialMediaLinks from "../components/layout/SocialMediaLinks";
import { usePageTitle } from "../hooks/usePageTitle";

function AboutPage() {
  const [about, setAbout] = useState(null);
  const [error, setError] = useState(null);

  usePageTitle("About");

  useEffect(() => {
    getAboutPage()
      .then(setAbout)
      .catch((error) => {
        console.error(error);
        setError(error);
      });
  }, []);

  const aboutText = about?.text;

  return (
    <>
      <h1 className="title">About</h1>

      <SocialMediaLinks />

      {aboutText ? (
        <div className="description">
          {aboutText.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      ) : (
        <p className="description">Coming soon</p>
      )}

      {error && <p className="description">Could not load about content.</p>}
    </>
  );
}

export default AboutPage;
