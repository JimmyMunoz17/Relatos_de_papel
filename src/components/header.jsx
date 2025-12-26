import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header-footer">
      <nav className="header-footer-text">
        <Link to="/" className="mr-4">Relatos de papel</Link>
        <Link to="/cart">Carrito</Link>
      </nav>
    </header>
  );
};

export default Header;