import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import books from "../data/booksMock";
import { useCart } from "../context/CartContext";
import CartList from "./cart/CartList";
import CartSummary from "./cart/CartSummary";

const Header = ({ user, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalItems, totalPrice } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Filtrar libros cada vez que el usuario escribe
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const filtered = books.filter((book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 5);
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

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-coffee-400 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo  */}
          <div className="flex items-center">
            <Link to="/" className="text-4xl font-bold text-coffee-700 hover:text-coffee-950 transition-colors">
              Relatos de papel
            </Link>
          </div>

          {/* Barra de búsqueda  */}
          <div className="flex-1 max-w-md mx-8 relative">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-coffee-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar libro por nombre..."
                className="block w-full pr-10 px-4 py-2 border border-gray-300 bg-coffee-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-coffee-950 placeholder-coffee-950"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>

            {/* Lista de Sugerencias */}
            {suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-md shadow-lg py-1 z-50 border max-h-80 overflow-y-auto">
                {suggestions.map((book, index) => (
                  <div
                    key={book.id}
                    onClick={() => selectSuggestion(book.id)}
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3 transition-colors ${index < suggestions.length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                  >
                    <img src={book.img} alt={book.title} className="w-8 h-10 object-cover rounded shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{book.title}</p>
                      <p className="text-xs text-gray-500 truncate">{book.author}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Menú de navegación */}
          <div className="flex items-center gap-4">
            {/* Dropdown del Carrito */}
            <div className="relative">
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="flex items-center space-x-2 text-sm rounded-full bg-gray-100 px-3 py-2 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors h-12"
              >
                <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 8L5 21a2 2 0 002 2h10a2 2 0 002-2H7m0 0v-4a2 2 0 012-2h6a2 2 0 012 2v4m-8 0h4" />
                </svg>
                <span className="text-black">Carrito ({totalItems})</span>
                <svg className={`h-4 w-4 text-gray-600 transition-transform ${isCartOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isCartOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-4 px-4 z-50 border max-h-96 overflow-y-auto">
                  <CartList />
                  <hr className="my-3 border-gray-200" />
                  <CartSummary />
                  {totalItems > 0 && (
                    <div className="mt-4 space-y-2">


                      <Link
                        to="/checkout"
                        className="block w-full text-center px-4 py-2 text-sm text-white bg-[#F54900] hover:bg-[#d84000] rounded transition-colors"
                        onClick={() => setIsCartOpen(false)}
                      >
                        Proceder al Checkout
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Menú de usuario */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-sm rounded-full bg-gray-100 px-3 py-2 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors h-12"
                  >
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=3b82f6&color=fff`}
                      alt={user.name}
                    />
                    <span className="text-black">{user.name}</span>
                    <svg className={`h-4 w-4 text-gray-600 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Mi Perfil
                      </Link>
                      <Link
                        to="/cart"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Carrito
                      </Link>
                      <hr className="border-gray-200 my-1" />
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onLogout();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link
                    to="/login"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Mi Cuenta
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;