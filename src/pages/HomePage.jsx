import React from "react";
import books from "../data/booksMock";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import CheckoutSuccess from "../components/checkout/CheckoutSuccess";

// Imports para el carrusel pagina gome
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const HomePage = () => {
  const { addItem } = useCart();
  const featuredBooks = books.slice(0, 5); // Selecciona los primeros 5 libros como destacados de la semana

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <CheckoutSuccess />

      {/* Seccion de carrusel */}
      <section className="mb-12">
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
      </section>

      {/* Catálogo de libros con imagenes */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Catálogo</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((b) => (
          <div
            key={b.id}
            className="border p-4 rounded-xl flex flex-col bg-white hover:shadow-lg transition-all group"
          >
            <div className="relative overflow-hidden rounded-lg mb-4">
              <img
                src={b.img}
                alt={b.title}
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="font-bold text-gray-900 truncate">{b.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{b.author}</p>
            <div className="mt-auto">
              <p className="text-xl font-bold text-gray-900 mb-4">${b.price}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => addItem(b)}
                  className="flex-1 bg-orange-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-orange-700 transition"
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
    </div>
  );
};

export default HomePage;
