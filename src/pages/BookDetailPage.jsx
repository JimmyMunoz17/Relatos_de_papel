import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import localBooks from "../data/booksMock";
import { getBookById, registerPurchase } from "../services/bookService";
import { useCart } from "../context/CartContext";

const BookDetailPage = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseMsg, setPurchaseMsg] = useState(null);

  const loadBook = useCallback(
    async (signal) => {
      try {
        const apiBook = await getBookById(id, signal);
        setBook(apiBook);
      } catch (err) {
        if (err.name !== "AbortError") {
          const localBook = localBooks.find((b) => b.id === id);
          setBook(localBook || null);
        }
      }
    },
    [id],
  );

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    loadBook(controller.signal).finally(() => setLoading(false));
    return () => controller.abort();
  }, [loadBook]);

  const handleDirectPurchase = async () => {
    if (!book) return;
    setIsPurchasing(true);
    setPurchaseMsg(null);
    try {
      await registerPurchase(book.id, 1);
      // Recargar el libro para obtener el stock actualizado
      await loadBook();
      setPurchaseMsg({
        type: "success",
        text: `¡Compra registrada! 1 unidad de "${book.title}"`,
      });
      setTimeout(() => setPurchaseMsg(null), 4000);
    } catch (err) {
      console.error("Error al registrar compra:", err);
      setPurchaseMsg({
        type: "error",
        text: "Error al procesar la compra. Intenta de nuevo.",
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
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
        <span className="text-gray-500">Cargando libro...</span>
      </div>
    );
  }

  if (!book) return <div className="p-6">Libro no encontrado</div>;
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className=" grid grid-cols-1 lg:grid-cols-3 gap-8">
        <aside className="space-y-6">
          <div className=" border rounded-b-lg overflow-hidden">
            <img
              src={book.img}
              alt={book.title}
              loading="lazy"
              className="w-full object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "https://res.cloudinary.com/ddbtvrcr0/image/upload/v1767207072/Relatos%20de%20papel/img_book_v0lt4v.svg";
              }}
            ></img>
          </div>
          <div className="grid grid-cols-2 gap-y-1 text-sm pl-10 space-y-1 text-gray-700">
            <BookInfo label="Formato:" value={book.format} />
            <BookInfo label="Editorial:" value={book.editorial} highlight />
            <BookInfo label="Autor:" value={book.author} highlight />
            <BookInfo label="Categoria:" value={book.category} />
            <BookInfo label="Año:" value={book.year} />
            <BookInfo label="Idioma:" value={book.language} />
            <BookInfo label="N° páginas:" value={book.pages} />
            {book.isbn && <BookInfo label="ISBN:" value={book.isbn} />}
            {book.valoracion > 0 && (
              <BookInfo
                label="Valoración:"
                value={`${"★".repeat(book.valoracion)}${"☆".repeat(5 - book.valoracion)} (${book.valoracion}/5)`}
                highlight
              />
            )}
          </div>
        </aside>
        <main className="lg:col-span-1 space-y-6">
          <div>
            <h1 className=" text-2xl font-bold text-gray-900">{book.title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {book.author} (Autor) - {book.editorial} - Libro Físico
            </p>
          </div>
          <section>
            <h2 className="text-lg font-semibold text-orange-600 mb-2">
              Reseña del libro
            </h2>
            <p className="text-base text-gray-700 leading-relaxed">
              {book.description}
            </p>
          </section>
        </main>
        <aside className="border rounded p-6 h-fit space-y-4">
          <h1 className="font-semibold text-2xl text-center">Libro Nuevo</h1>

          {/* Stock en tiempo real */}
          {book.stock > 0 ? (
            <div className="flex items-center justify-center gap-2">
              <span className="inline-block w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-green-600 text-base font-medium">
                {book.stock > 100
                  ? `Más de 100 unidades disponibles`
                  : `${book.stock} unidades disponibles`}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span className="inline-block w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              <p className="text-red-500 text-base font-medium">Sin stock</p>
            </div>
          )}

          {book.price > 0 ? (
            <p className="text-2xl text-center text-gray-600">${book.price}</p>
          ) : (
            <p className="text-lg text-center text-gray-400">
              Precio no disponible
            </p>
          )}

          {/* Mensaje de compra */}
          {purchaseMsg && (
            <div
              className={`text-sm text-center px-3 py-2 rounded-lg ${
                purchaseMsg.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-600 border border-red-200"
              }`}
            >
              {purchaseMsg.text}
            </div>
          )}

          {/* Botón agregar al carrito */}
          <button
            onClick={() => {
              addItem(book);
              setPurchaseMsg({
                type: "success",
                text: "Agregado al carrito",
              });
              setTimeout(() => setPurchaseMsg(null), 3000);
            }}
            disabled={book.price === 0}
            className="w-full border-2 border-orange-500 text-orange-600 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold py-3 rounded-lg transition"
          >
            Agregar al carrito
          </button>

          <p className="text-sm text-center text-gray-600 ">
            Se enviará desde la bodega entre el <br></br>
            <storage>Lunes 12 de Enero</storage> y el{" "}
            <storage>Lunes 26 de Enero</storage>
          </p>
        </aside>
      </div>
    </div>
  );
};

function BookInfo({ label, value, highlight }) {
  return (
    <>
      <strong>{label}</strong>
      <span className={highlight ? "text-orange-600" : "text-gray-800"}>
        {value}
      </span>
    </>
  );
}

export default BookDetailPage;
