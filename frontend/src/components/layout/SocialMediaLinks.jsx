import { useFrontendContext } from "../../context/useFrontendContext";

const socialMediaIcons = {
  gh: "fa-brands fa-github",
  in: "fa-brands fa-linkedin-in",
  fb: "fa-brands fa-facebook",
  ig: "fa-brands fa-instagram",
  yt: "fa-brands fa-youtube",
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

        if (!iconClassName) {
          return null;
        }

        return (
          <li className="social-media-item" key={socialMediaLink.id}>
            <a
              className="social-media-link"
              href={socialMediaLink.url}
              target="_blank"
              rel="noreferrer"
            >
              <i className={iconClassName}></i>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export default SocialMediaLinks;
