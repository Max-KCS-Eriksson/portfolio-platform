import { useFrontendContext } from "../../context/useFrontendContext";
import "./SocialMediaLinks.css";

const socialMediaIcons = {
  gh: "fa-brands fa-github",
  in: "fa-brands fa-linkedin",
  fb: "fa-brands fa-facebook",
  ig: "fa-brands fa-instagram",
  yt: "fa-brands fa-youtube",
};

const socialMediaLabels = {
  gh: "GitHub",
  in: "LinkedIn",
  fb: "Facebook",
  ig: "Instagram",
  yt: "YouTube",
};

function SocialMediaLinks() {
  const { contextData } = useFrontendContext();

  const socialMediaLinks = contextData?.social_media_links ?? [];

  if (socialMediaLinks.length === 0) {
    return null;
  }

  return (
    <ul className="social-media-links">
      {socialMediaLinks.map((socialMediaLink) => {
        const iconClassName = socialMediaIcons[socialMediaLink.social_media];
        const label = socialMediaLabels[socialMediaLink.social_media];

        if (!iconClassName || !label) {
          return null;
        }

        return (
          <li className="social-media-item" key={socialMediaLink.id}>
            <a
              className="social-media-link"
              href={socialMediaLink.url}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
            >
              <i className={iconClassName} aria-hidden="true"></i>
              <span>{label}</span>
              <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export default SocialMediaLinks;
