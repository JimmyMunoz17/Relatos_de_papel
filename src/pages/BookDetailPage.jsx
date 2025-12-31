import { useParams } from "react-router-dom";
import books from "../data/booksMock";
import { useCart } from "../context/CartContext";

const BookDetailPage = () => {
  const { id } = useParams();
  const book = books.find((b) => b.id === id);
  const { addItem } = useCart();
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
                e.currentTarget.src = "/public/assets/img_book.svg";
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
          <p className="text-green-600 text-base font-medium text-center">
            Quedan más de 100 unidades
          </p>
          <p className="text-2xl text-center text-gray-600">${book.price}</p>
          <button
            onClick={() => addItem(book)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition"
          >
            Comprar
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
