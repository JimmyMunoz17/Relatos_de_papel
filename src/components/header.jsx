import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import books from "../data/booksMock";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  // Filtrar libros cada vez que el usuario escribe
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const filtered = books.filter((book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 5); // Limitamos a 5 sugerencias para que no sea una lista infinita
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    const term = searchTerm.trim().toLowerCase();
    if (!term) return;

    const foundBook = books.find((b) => b.title.toLowerCase().includes(term));
    if (foundBook) {
      navigate(`/book/${foundBook.id}`);
      setSearchTerm("");
      setSuggestions([]);
    }
  };

  const selectSuggestion = (bookId) => {
    navigate(`/book/${bookId}`);
    setSearchTerm("");
    setSuggestions([]);
  };

  return (
    <header className="bg-white border-b p-4 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <Link to="/" className="text-xl font-bold text-black min-w-max">
          Relatos de papel
        </Link>

        {/* Contenedor del buscador con posición relativa para la lista */}
        <div className="relative w-full max-w-md">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input
              type="text"
              placeholder="Buscar libro por nombre..."
              className="w-full px-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-500 outline-none text-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="absolute right-3 text-gray-500 hover:text-black">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          {/* Lista de Sugerencias */}
          {suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-[60]">
              {suggestions.map((book) => (
                <li
                  key={book.id}
                  onClick={() => selectSuggestion(book.id)}
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3 border-b last:border-none"
                >
                  <img src={book.img} alt={book.title} className="w-8 h-10 object-cover rounded" />
                  <div>
                    <p className="text-sm font-semibold text-black leading-none">{book.title}</p>
                    <p className="text-xs text-gray-500">{book.author}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex gap-6 font-medium text-black">
          <Link to="/cart" className="hover:opacity-70 transition">Carrito</Link>
          <Link to="/login" className="hover:opacity-70 transition">Mi Cuenta</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;