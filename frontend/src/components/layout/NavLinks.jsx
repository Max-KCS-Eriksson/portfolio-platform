import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../routes/paths";

function NavLinks({ isMenuOpen, onNavigate }) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <ul className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
      {!isHomePage && (
        <li className="nav-item">
          <Link className="nav-link" to={ROUTES.home} onClick={onNavigate}>
            Home<span className="path">/</span>
          </Link>
        </li>
      )}

      <li className="nav-item">
        <Link className="nav-link" to={ROUTES.portfolio} onClick={onNavigate}>
          Portfolio<span className="path">/</span>
        </Link>
      </li>

      <li className="nav-item">
        <Link className="nav-link" to={ROUTES.blog} onClick={onNavigate}>
          Blog<span className="path">/</span>
        </Link>
      </li>

      <li className="nav-item">
        <Link className="nav-link" to={ROUTES.about} onClick={onNavigate}>
          About<span className="path">/</span>
        </Link>
      </li>
    </ul>
  );
}

export default NavLinks;
