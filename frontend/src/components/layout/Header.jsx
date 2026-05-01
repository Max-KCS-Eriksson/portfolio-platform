import { useState } from "react";
import { Link } from "react-router-dom";
import { useFrontendContext } from "../../context/useFrontendContext";
import NavLinks from "./NavLinks";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { contextData } = useFrontendContext();

  const domainName = contextData?.domain_name ?? "";

  function toggleMenu() {
    setIsMenuOpen((current) => !current);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="navbar">
      <h1>
        <Link className="home-link" to="/" onClick={closeMenu}>
          {domainName}
        </Link>
      </h1>

      <nav>
        <NavLinks isMenuOpen={isMenuOpen} onNavigate={closeMenu} />

        <button
          className={`hamburger ${isMenuOpen ? "active" : ""}`}
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          onClick={toggleMenu}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </nav>
    </header>
  );
}

export default Header;
