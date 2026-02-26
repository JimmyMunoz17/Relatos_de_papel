import React, { useState, useEffect } from "react";
import localBooks from "../data/booksMock";
import { useCart } from "../context/CartContext";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import {
  searchBooksFuzzy,
  getAllBooks,
  searchByCategory,
} from "../services/bookService";
import CheckoutSuccess from "../components/checkout/CheckoutSuccess";

// Imports para el carrusel pagina gome
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const HomePage = () => {
  const { addItem } = useCart();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const query = searchParams.get("q") || "";
  const categoryFilter = searchParams.get("cat") || "";

  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Estado para resultados por categoría
  const [categoryResults, setCategoryResults] = useState([]);
  const [isCategorySearching, setIsCategorySearching] = useState(false);
  const [categoryError, setCategoryError] = useState(null);

  // Estado para los libros cargados desde el API
  const [catalogBooks, setCatalogBooks] = useState(localBooks);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);
  const [catalogError, setCatalogError] = useState(null);

  // Paginación: cantidad de libros visibles en el catálogo
  const BOOKS_PER_PAGE = 8;
  const [visibleCount, setVisibleCount] = useState(BOOKS_PER_PAGE);
  const visibleBooks = catalogBooks.slice(0, visibleCount);
  const hasMore = visibleCount < catalogBooks.length;
  const progressPercent = Math.min(
    (visibleCount / catalogBooks.length) * 100,
    100,
  );

  // Cargar todos los libros desde el gateway al montar el componente
  useEffect(() => {
    const controller = new AbortController();
    const loadBooks = async () => {
      setIsLoadingCatalog(true);
      setCatalogError(null);
      try {
        const books = await getAllBooks(controller.signal);
        if (books.length > 0) {
          setCatalogBooks(books);
        }
        // Si no hay libros en el API, se mantienen los locales como fallback
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error cargando catálogo desde API:", err);
          setCatalogError(
            "No se pudo conectar con el servidor. Mostrando catálogo local.",
          );
          // Mantener los libros locales como fallback
        }
      } finally {
        setIsLoadingCatalog(false);
      }
    };

    loadBooks();
    return () => controller.abort();
  }, [location.state?.successMessage]);

  const featuredBooks = catalogBooks.slice(0, 5);

  // Ejecutar búsqueda cuando cambia el query
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    const controller = new AbortController();
    const fetchResults = async () => {
      setIsSearching(true);
      setSearchError(null);
      try {
        const results = await searchBooksFuzzy(query, controller.signal);
        setSearchResults(results);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error buscando libros:", err);
          setSearchError(
            "No se pudieron cargar los resultados. Verifica que el servidor esté activo.",
          );
          setSearchResults([]);
        }
      } finally {
        setIsSearching(false);
      }
    };

    fetchResults();
    return () => controller.abort();
  }, [query]);

  // Ejecutar búsqueda por categoría cuando cambia el filtro
  useEffect(() => {
    if (!categoryFilter.trim()) {
      setCategoryResults([]);
      setCategoryError(null);
      return;
    }

    const controller = new AbortController();
    const fetchCategoryResults = async () => {
      setIsCategorySearching(true);
      setCategoryError(null);
      try {
        const results = await searchByCategory(
          categoryFilter,
          controller.signal,
        );
        setCategoryResults(results);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error buscando por categoría:", err);
          setCategoryError(
            "No se pudieron cargar los resultados por categoría.",
          );
          setCategoryResults([]);
        }
      } finally {
        setIsCategorySearching(false);
      }
    };

    fetchCategoryResults();
    return () => controller.abort();
  }, [categoryFilter]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <CheckoutSuccess />

      {/* Sección de resultados de búsqueda */}
      {query && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Resultados para:{" "}
              <span className="text-orange-600">"{query}"</span>
            </h2>
            <Link
              to="/"
              className="text-sm text-orange-600 hover:text-orange-700 font-semibold transition"
            >
              ✕ Limpiar búsqueda
            </Link>
          </div>

          {isSearching ? (
            <div className="flex justify-center items-center py-16">
              <svg
                className="animate-spin h-8 w-8 text-orange-500 mr-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              <span className="text-gray-500 text-lg">Buscando libros...</span>
            </div>
          ) : searchError ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-600">{searchError}</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-10 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p className="text-gray-500 text-lg">
                No se encontraron libros para "{query}"
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Intenta con otro término de búsqueda
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchResults.map((b) => (
                <div
                  key={b.id}
                  className="border p-4 rounded-xl flex flex-col bg-white hover:shadow-lg transition-all group"
                >
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img
                      src={b.img}
                      alt={b.title}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://res.cloudinary.com/ddbtvrcr0/image/upload/v1767207072/Relatos%20de%20papel/img_book_v0lt4v.svg";
                      }}
                    />
                    {b.stock > 0 && (
                      <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        Stock: {b.stock}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 truncate">
                    {b.title}
                  </h3>
                  <p className="text-sm text-gray-500">{b.author}</p>
                  {/* Valoración con estrellas */}
                  {b.valoracion > 0 && (
                    <div className="flex items-center gap-1 mt-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${i < b.valoracion ? "text-yellow-400" : "text-gray-300"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-xs text-gray-500 ml-1">
                        ({b.valoracion}/5)
                      </span>
                    </div>
                  )}
                  {b.isbn && (
                    <p className="text-xs text-gray-400 mb-2">ISBN: {b.isbn}</p>
                  )}
                  <div className="mt-auto">
                    {b.price > 0 ? (
                      <p className="text-xl font-bold text-gray-900 mb-4">
                        ${b.price}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400 mb-4">
                        Precio no disponible
                      </p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => addItem(b)}
                        disabled={b.price === 0}
                        className="flex-1 bg-orange-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Agregar
                      </button>
                      <Link
                        to={`/book/${b.id}`}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
                      >
                        Detalles
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Sección de resultados por categoría */}
      {categoryFilter && !query && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Categoría:{" "}
              <span className="text-orange-600">"{categoryFilter}"</span>
            </h2>
            <Link
              to="/"
              className="text-sm text-orange-600 hover:text-orange-700 font-semibold transition"
            >
              ✕ Limpiar filtro
            </Link>
          </div>

          {isCategorySearching ? (
            <div className="flex justify-center items-center py-16">
              <svg
                className="animate-spin h-8 w-8 text-orange-500 mr-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              <span className="text-gray-500 text-lg">
                Buscando por categoría...
              </span>
            </div>
          ) : categoryError ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-600">{categoryError}</p>
            </div>
          ) : categoryResults.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-10 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <p className="text-gray-500 text-lg">
                No se encontraron libros en la categoría "{categoryFilter}"
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">
                {categoryResults.length} libro
                {categoryResults.length !== 1 ? "s" : ""} encontrado
                {categoryResults.length !== 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categoryResults.map((b) => (
                  <div
                    key={b.id}
                    className="border p-4 rounded-xl flex flex-col bg-white hover:shadow-lg transition-all group"
                  >
                    <div className="relative overflow-hidden rounded-lg mb-4">
                      <img
                        src={b.img}
                        alt={b.title}
                        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://res.cloudinary.com/ddbtvrcr0/image/upload/v1767207072/Relatos%20de%20papel/img_book_v0lt4v.svg";
                        }}
                      />
                      {b.stock > 0 && (
                        <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                          Stock: {b.stock}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 truncate">
                      {b.title}
                    </h3>
                    <p className="text-sm text-gray-500">{b.author}</p>
                    {b.categoria && (
                      <span className="inline-block mt-1 mb-1 px-2 py-0.5 text-xs bg-orange-100 text-orange-700 rounded-full w-fit">
                        {b.categoria}
                      </span>
                    )}
                    {b.valoracion > 0 && (
                      <div className="flex items-center gap-1 mt-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${i < b.valoracion ? "text-yellow-400" : "text-gray-300"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-xs text-gray-500 ml-1">
                          ({b.valoracion}/5)
                        </span>
                      </div>
                    )}
                    <div className="mt-auto">
                      {b.price > 0 ? (
                        <p className="text-xl font-bold text-gray-900 mb-4">
                          ${b.price}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400 mb-4">
                          Precio no disponible
                        </p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => addItem(b)}
                          disabled={b.price === 0}
                          className="flex-1 bg-orange-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Agregar
                        </button>
                        <Link
                          to={`/book/${b.id}`}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
                        >
                          Detalles
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* Sección de carrusel y catálogo - solo si no hay búsqueda activa */}
      {!query && !categoryFilter && (
        <>
          {/* Aviso si falló la conexión al API */}
          {catalogError && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
              <svg
                className="h-5 w-5 text-yellow-500 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <p className="text-sm text-yellow-700">{catalogError}</p>
            </div>
          )}

          <section className="mb-12">
            {isLoadingCatalog ? (
              <div className="flex justify-center items-center py-16">
                <svg
                  className="animate-spin h-8 w-8 text-orange-500 mr-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                <span className="text-gray-500 text-lg">
                  Cargando catálogo...
                </span>
              </div>
            ) : (
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 4000 }}
                className="rounded-2xl shadow-xl border overflow-hidden"
              >
                {featuredBooks.map((b) => (
                  <SwiperSlide key={b.id}>
                    <div className="bg-white p-10 flex flex-col md:flex-row items-center gap-10">
                      <img
                        src={b.img}
                        alt={b.title}
                        className="w-48 h-64 object-cover shadow-2xl rounded"
                      />
                      <div className="flex-1">
                        <span className="text-orange-600 font-bold text-xs uppercase tracking-widest">
                          {b.category}
                        </span>
                        <h3 className="text-4xl font-bold text-gray-900 mt-2">
                          {b.title}
                        </h3>
                        <p className="text-gray-600 mt-4 text-lg line-clamp-3">
                          {b.description}
                        </p>
                        <div className="mt-8 flex items-center gap-6">
                          <span className="text-3xl font-bold text-gray-900">
                            ${b.price}
                          </span>
                          <button
                            onClick={() => addItem(b)}
                            className="bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-700 transition shadow-lg"
                          >
                            Añadir al carrito
                          </button>
                          <Link
                            to={`/book/${b.id}`}
                            className="text-gray-500 font-semibold hover:text-orange-600 transition"
                          >
                            Ver detalles
                          </Link>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </section>

          {/* Catálogo de libros con imagenes */}
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Catálogo
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({catalogBooks.length} libros)
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {visibleBooks.map((b) => (
              <div
                key={b.id}
                className="border p-4 rounded-xl flex flex-col bg-white hover:shadow-lg transition-all group"
              >
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={b.img}
                    alt={b.title}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://res.cloudinary.com/ddbtvrcr0/image/upload/v1767207072/Relatos%20de%20papel/img_book_v0lt4v.svg";
                    }}
                  />
                  {b.stock > 0 && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      Stock: {b.stock}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 truncate">{b.title}</h3>
                <p className="text-sm text-gray-500">{b.author}</p>
                {/* Valoración con estrellas */}
                {b.valoracion > 0 && (
                  <div className="flex items-center gap-1 mt-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ${i < b.valoracion ? "text-yellow-400" : "text-gray-300"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                )}
                <div className="mt-auto">
                  {b.price > 0 ? (
                    <p className="text-xl font-bold text-gray-900 mb-4">
                      ${b.price}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 mb-4">
                      Precio no disponible
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => addItem(b)}
                      disabled={b.price === 0}
                      className="flex-1 bg-orange-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Agregar
                    </button>
                    <Link
                      to={`/book/${b.id}`}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
                    >
                      Detalles
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Barra de progreso y botón cargar más */}
          <div className="mt-10 flex flex-col items-center gap-4">
            <div className="w-full max-w-md">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>
                  Mostrando {Math.min(visibleCount, catalogBooks.length)} de{" "}
                  {catalogBooks.length} libros
                </span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-orange-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
            {hasMore ? (
              <button
                onClick={() => setVisibleCount((prev) => prev + BOOKS_PER_PAGE)}
                className="px-8 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition shadow-md"
              >
                Cargar más libros
              </button>
            ) : (
              <p className="text-sm text-gray-400">
                Has visto todos los libros del catálogo
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
