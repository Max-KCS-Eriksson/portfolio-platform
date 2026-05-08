import { useFrontendContext } from "../../context/useFrontendContext";
import SocialMediaLinks from "./SocialMediaLinks";

function Footer() {
  const { contextData } = useFrontendContext();

  const currentYear = new Date().getFullYear();
  const siteOwner = contextData?.siteOwner ?? "";

  return (
    <footer className="footer">
      <p className="copyright">
        © {currentYear} {siteOwner}
      </p>

      <SocialMediaLinks />
    </footer>
  );
}

export default Footer;
