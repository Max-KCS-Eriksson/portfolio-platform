import NavLinks from "../components/layout/NavLinks";
import { usePageTitle } from "../hooks/usePageTitle";

function HomePage() {
  usePageTitle("");

  return (
    <div className="main-menu">
      <NavLinks />
    </div>
  );
}

export default HomePage;
