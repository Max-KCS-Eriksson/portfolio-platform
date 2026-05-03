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

/**
 * Render social media links from explicit props or frontend context.
 *
 * @param {object} props
 * @param {Array<{id: number|string, social_media: string, url: string}>} [props.links]
 * Optional social-media link data to render instead of the site-wide links from frontend context.
 * @param {string} [props.linkClassName]
 * Optional class name for each anchor so callers can reuse provider icons with caller-owned link styling.
 */
function SocialMediaLinks({ links, linkClassName = "social-media-link" }) {
  const { contextData } = useFrontendContext();

  const socialMediaLinks = links ?? contextData?.social_media_links ?? [];

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
            <a className={linkClassName} href={socialMediaLink.url} target="_blank" rel="noreferrer" aria-label={label}>
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
