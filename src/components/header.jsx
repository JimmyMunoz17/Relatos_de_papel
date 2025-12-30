import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import books from "../data/booksMock";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    
    const term = searchTerm.trim().toLowerCase();
    if (!term) return;

    // Buscar el libro por título y navegar si se encuentra 
    const foundBook = books.find(b => b.title.toLowerCase().includes(term));

    if (foundBook) {
      navigate(`/book/${foundBook.id}`);
      setSearchTerm("");
    } else {
      alert("No se encontró ningún libro con ese nombre.");
    }
  };

  return (
    <header className="bg-white border-b p-4 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-black min-w-max">
          Relatos de papel
        </Link>

        {/* Barra de Búsqueda */}
        <form onSubmit={handleSearch} className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Buscar libro por nombre..."
            className="w-full px-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-500 outline-none text-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="absolute right-3 top-2.5 text-gray-500 hover:text-black">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>

        {/* Enlaces */}
        <div className="flex gap-6 font-medium text-black">
          <Link to="/cart" className="hover:opacity-70 transition">
            Carrito
          </Link>
          <Link to="/login" className="hover:opacity-70 transition">
            Mi Cuenta
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;