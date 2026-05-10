import { useCoreContext } from "../../context/useCoreContext";
import SocialMediaLinks from "./SocialMediaLinks";

function Footer() {
  const { coreContext } = useCoreContext();

  const currentYear = new Date().getFullYear();
  const siteOwner = coreContext?.siteOwner ?? "";

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
