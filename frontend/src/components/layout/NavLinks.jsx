import { Link, useLocation } from "react-router-dom";

function NavLinks({ isMenuOpen, onNavigate }) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <ul className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
      {!isHomePage && (
        <li className="nav-item">
          <Link className="nav-link" to="/" onClick={onNavigate}>
            Home<span className="path">/</span>
          </Link>
        </li>
      )}

      <li className="nav-item">
        <Link className="nav-link" to="/portfolio/" onClick={onNavigate}>
          Portfolio<span className="path">/</span>
        </Link>
      </li>

      <li className="nav-item">
        <Link className="nav-link" to="/blog/" onClick={onNavigate}>
          Blog<span className="path">/</span>
        </Link>
      </li>

      <li className="nav-item">
        <Link className="nav-link" to="/about/" onClick={onNavigate}>
          About<span className="path">/</span>
        </Link>
      </li>
    </ul>
  );
}

export default NavLinks;
