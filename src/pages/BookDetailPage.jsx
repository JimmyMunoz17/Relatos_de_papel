import { useParams } from 'react-router-dom';
import books from '../data/booksMock';
import { useCart } from '../context/CartContext';

const BookDetailPage = () => {
  const { id } = useParams();
  const book = books.find(b => b.id === id);
  const { addItem } = useCart();

  if (!book) return <div className="p-6">Libro no encontrado</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">{book.title}</h2>
      <p className="text-sm text-gray-600">{book.author}</p>
      <p className="mt-2">{book.description}</p>
      <p className="mt-2 font-semibold">${book.price}</p>
      <div className="mt-4">
        <button onClick={() => addItem(book)} className="px-4 py-2 bg-blue-600 text-white rounded">Agregar al carrito</button>
      </div>
    </div>
  );
};

export default BookDetailPage;
