import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGithub, faInstagram, faLinkedin, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { useFrontendContext } from "../../context/useFrontendContext";
import "./SocialMediaLinks.css";

const socialMediaIcons = {
  gh: faGithub,
  in: faLinkedin,
  fb: faFacebook,
  ig: faInstagram,
  yt: faYoutube,
};

const socialMediaLabels = {
  gh: "GitHub",
  in: "LinkedIn",
  fb: "Facebook",
  ig: "Instagram",
  yt: "YouTube",
};

/**
 * Render social media links from explicit props or frontend context.
 *
 * @param {object} props
 * @param {Array<{id: number|string, socialMedia: string, url: string}>} [props.links]
 * Optional social-media link data to render instead of the site-wide links from frontend context.
 * @param {string} [props.linkClassName]
 * Optional class name for each anchor so callers can reuse provider icons with caller-owned link styling.
 */
function SocialMediaLinks({ links, linkClassName = "social-media-link" }) {
  const { contextData } = useFrontendContext();

  const socialMediaLinks = links ?? contextData?.socialMediaLinks ?? [];

  if (socialMediaLinks.length === 0) {
    return null;
  }

  return (
    <ul className="social-media-links">
      {socialMediaLinks.map((socialMediaLink) => {
        const icon = socialMediaIcons[socialMediaLink.socialMedia];
        const label = socialMediaLabels[socialMediaLink.socialMedia];

        if (!icon || !label) {
          return null;
        }

        return (
          <li className="social-media-item" key={socialMediaLink.id}>
            <a className={linkClassName} href={socialMediaLink.url} target="_blank" rel="noreferrer" aria-label={label}>
              <FontAwesomeIcon icon={icon} aria-hidden="true" />
              <span>{label}</span>
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} aria-hidden="true" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export default SocialMediaLinks;
