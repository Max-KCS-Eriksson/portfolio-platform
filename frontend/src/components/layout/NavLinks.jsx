import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../routes/paths";

function NavLinks({ isMenuOpen, onNavigate }) {
  const location = useLocation();
  const isHomePage = location.pathname === ROUTES.home;

  function isCurrentRoute(path) {
    return location.pathname === path;
  }

  function getNavLinkClassName(path) {
    return `nav-link${isCurrentRoute(path) ? " current" : ""}`;
  }

  function getNavMenuClassName() {
    return `nav-menu ${isMenuOpen ? "active" : ""}`;
  }

  return (
    <ul className={getNavMenuClassName()}>
      {!isHomePage && (
        <li className="nav-item">
          <Link className={getNavLinkClassName(ROUTES.home)} to={ROUTES.home} onClick={onNavigate}>
            Home
          </Link>
        </li>
      )}

      <li className="nav-item">
        <Link className={getNavLinkClassName(ROUTES.portfolio)} to={ROUTES.portfolio} onClick={onNavigate}>
          Portfolio
        </Link>
      </li>

      <li className="nav-item">
        <Link className={getNavLinkClassName(ROUTES.about)} to={ROUTES.about} onClick={onNavigate}>
          About
        </Link>
      </li>
    </ul>
  );
}

export default NavLinks;
